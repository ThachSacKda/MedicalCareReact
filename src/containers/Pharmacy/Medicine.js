import React, { Component } from 'react';
import { createNewMedicine, getAllMedicines, updateMedicine, deleteMedicine } from '../../services/userService';
import './Pharmacy.scss';
import Header from '../Header/Header';
import { connect } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

class Medicine extends Component {
    constructor(props) {
        super(props);
        this.state = {
            medicineName: '',
            composition: '',
            uses: '',
            sideEffects: '',
            imageUrl: '',
            manufacturer: '',
            medicines: [],
            searchQuery: '',
            currentPage: 1,
            itemsPerPage: 20,
            editingMedicineId: null // Track if we're editing a specific medicine
        };
    }

    async componentDidMount() {
        await this.fetchAllMedicines();
    }

    fetchAllMedicines = async () => {
        let response = await getAllMedicines();
        if (response && response.errCode === 0) {
            this.setState({ medicines: response.data });
        }
    }

    handleInputChange = (event, field) => {
        this.setState({
            [field]: event.target.value
        });
    }

    // Add medicine
    handleAddMedicine = async () => {
        let { medicineName, composition, uses, sideEffects, imageUrl, manufacturer } = this.state;
    
        if (!medicineName || !composition || !uses || !manufacturer) {
            Swal.fire('Missing required fields!', '', 'warning');
            return;
        }

        let response = await createNewMedicine({
            medicineName,
            composition,
            uses,
            sideEffects,
            imageUrl,
            manufacturer
        });

        if (response && response.errCode === 0) {
            Swal.fire('Medicine added successfully!', '', 'success');
            this.setState({
                medicineName: '',
                composition: '',
                uses: '',
                sideEffects: '',
                imageUrl: '',
                manufacturer: ''
            });
            await this.fetchAllMedicines();
        } else {
            Swal.fire('Failed to add medicine', '', 'error');
        }
    }

    // Update medicine
    handleUpdateMedicine = async () => {
        let { medicineName, composition, uses, sideEffects, imageUrl, manufacturer, editingMedicineId } = this.state;
        if (!medicineName || !composition || !uses || !manufacturer) {
            Swal.fire('Missing required fields!', '', 'warning');
            return;
        }

        let response = await updateMedicine({
            id: editingMedicineId,
            medicineName,
            composition,
            uses,
            sideEffects,
            imageUrl,
            manufacturer
        });

        if (response && response.errCode === 0) {
            Swal.fire('Medicine updated successfully!', '', 'success');
            this.setState({
                medicineName: '',
                composition: '',
                uses: '',
                sideEffects: '',
                imageUrl: '',
                manufacturer: '',
                editingMedicineId: null
            });
            await this.fetchAllMedicines();
        } else {
            Swal.fire('Failed to update medicine', '', 'error');
        }
    }

    // Edit medicine: Điền thông tin thuốc vào form
    handleEditMedicine = (medicine) => {
        this.setState({
            medicineName: medicine.medicineName,
            composition: medicine.composition,
            uses: medicine.uses,
            sideEffects: medicine.sideEffects,
            imageUrl: medicine.imageUrl,
            manufacturer: medicine.manufacturer,
            editingMedicineId: medicine.id
        });
    };

    // Delete medicine
    handleDeleteMedicine = async (id) => {
        if (window.confirm('Are you sure you want to delete this medicine?')) {
            try {
                let response = await deleteMedicine(id);
                
                if (response && response.data.errCode === 0) {
                    Swal.fire('Medicine deleted successfully!', '', 'success');
                    await this.fetchAllMedicines(); // Tải lại danh sách sau khi xóa thành công
                } else {
                    Swal.fire('Failed to delete medicine', '', 'error');
                }
            } catch (error) {
                console.error("Error deleting medicine:", error);
                Swal.fire('Failed to delete medicine', '', 'error');
            }
        }
    };

    // Tìm kiếm thuốc
    handleSearch = (event) => {
        this.setState({ searchQuery: event.target.value });
    }

    // Phân trang
    handlePageChange = (pageNumber) => {
        this.setState({ currentPage: pageNumber });
    }

    render() {
        const { medicines, searchQuery, currentPage, itemsPerPage, editingMedicineId } = this.state;

        let filteredMedicines = medicines.filter((medicine) => {
            return (
                medicine.medicineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                medicine.composition.toLowerCase().includes(searchQuery.toLowerCase()) ||
                medicine.uses.toLowerCase().includes(searchQuery.toLowerCase()) ||
                medicine.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });

        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentMedicines = filteredMedicines.slice(indexOfFirstItem, indexOfLastItem);
        const totalPages = Math.ceil(filteredMedicines.length / itemsPerPage);

        return (
            <>
                <Header  />
                <ToastContainer /> {/* Đặt ToastContainer tại đây */}
                <div className="medicine-form-container">
                    <h2>{editingMedicineId ? 'Edit Medicine' : 'Add New Medicine'}</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Medicine Name</label>
                            <input type="text" value={this.state.medicineName} onChange={(event) => this.handleInputChange(event, 'medicineName')} />
                        </div>
                        <div className="form-group">
                            <label>Composition</label>
                            <input type="text" value={this.state.composition} onChange={(event) => this.handleInputChange(event, 'composition')} />
                        </div>
                        <div className="form-group">
                            <label>Uses</label>
                            <input type="text" value={this.state.uses} onChange={(event) => this.handleInputChange(event, 'uses')} />
                        </div>
                        <div className="form-group">
                            <label>Side Effects</label>
                            <input type="text" value={this.state.sideEffects} onChange={(event) => this.handleInputChange(event, 'sideEffects')} />
                        </div>
                        <div className="form-group">
                            <label>Image URL</label>
                            <input type="text" value={this.state.imageUrl} onChange={(event) => this.handleInputChange(event, 'imageUrl')} />
                        </div>
                        <div className="form-group">
                            <label>Manufacturer</label>
                            <input type="text" value={this.state.manufacturer} onChange={(event) => this.handleInputChange(event, 'manufacturer')} />
                        </div>
                    </div>

                    {/* Hiển thị nút Add khi không chỉnh sửa và nút Update khi đang chỉnh sửa */}
                    {editingMedicineId ? (
                        <button onClick={this.handleUpdateMedicine}>Update Medicine</button>
                    ) : (
                        <button onClick={this.handleAddMedicine}>Add Medicine</button>
                    )}
                </div>

                <div className="medicine-list-container">
                    <h2>All Medicines</h2>
                    <div className="search-container">
                        <input type="text" placeholder="Search medicines..." value={searchQuery} onChange={this.handleSearch} />
                    </div>
                    <table className="medicine-table">
                        <thead>
                            <tr>
                                <th>Medicine Name</th>
                                <th>Composition</th>
                                <th>Uses</th>
                                <th>Side Effects</th>
                                <th>Image URL</th>
                                <th>Manufacturer</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentMedicines.length > 0 ?
                                currentMedicines.map((medicine, index) => (
                                    <tr key={index}>
                                        <td>{medicine.medicineName}</td>
                                        <td>{medicine.composition}</td>
                                        <td>{medicine.uses}</td>
                                        <td>{medicine.sideEffects}</td>
                                        <td><a href={medicine.imageUrl} target="_blank" rel="noopener noreferrer">View Image</a></td>
                                        <td>{medicine.manufacturer}</td>
                                        <td>
                                            <button className="edit-button" onClick={() => this.handleEditMedicine(medicine)}>
                                                <i className="fa fa-pencil"></i>
                                            </button>
                                            <button className="delete-button" onClick={() => this.handleDeleteMedicine(medicine.id)}>
                                                <i className="fa fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                )) : <tr><td colSpan="7">No medicines found</td></tr>}
                        </tbody>
                    </table>

                    <div className="pagination">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button key={index + 1} className={currentPage === index + 1 ? 'active' : ''} onClick={() => this.handlePageChange(index + 1)}>
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </>
        );
    }
}

export default connect(null)(Medicine);
