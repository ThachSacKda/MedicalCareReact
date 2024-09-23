import React, { Component } from 'react';
import './MedicalRecord.scss';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import Select from 'react-select';
import { getAllMedicines, addMedicalRecord, getMedicalRecordsByPatientId } from '../../../services/userService';  // Import API calls
import Header from '../../Header/Header';
import Swal from 'sweetalert2';

class MedicalRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataPatient: null,  // Store patient data
            diagnosis: '',  // Store diagnosis
            selectedMedicines: [],  // Store selected medicines
            note: '',  // Store note
            medicineOptions: [],  // Store medicines options from API
            medicines: [],  // Store medicines to be displayed
            medicalRecords: [], // Lấy dữ liệu hồ sơ bệnh án từ database
        };

        // Bind methods to the class instance
        this.fetchAllMedicines = this.fetchAllMedicines.bind(this);
        this.handleAddPrescription = this.handleAddPrescription.bind(this);
        this.fetchMedicalRecords = this.fetchMedicalRecords.bind(this);
    }

    // Fetch all medicines from the API
    fetchAllMedicines = async () => {
        try {
            const response = await getAllMedicines();
            if (response && response.errCode === 0) {
                const medicines = response.data;
                const medicineOptions = medicines.map(med => ({
                    value: med.id,
                    label: med.medicineName,
                    composition: med.composition,
                    uses: med.uses,
                    sideEffects: med.sideEffects,
                    manufacturer: med.manufacturer
                }));
                this.setState({ medicines, medicineOptions });
            }
        } catch (error) {
            console.error('Error fetching medicines:', error);
        }
    }

    // Fetch medical records from the API
    fetchMedicalRecords = async (patientId) => {
        try {
            const response = await getMedicalRecordsByPatientId(patientId);
            if (response && response.errCode === 0) {
                this.setState({ medicalRecords: response.data });
                console.log('medical record:', response)
            } else {
                console.error('Failed to fetch medical records');
            }
        } catch (error) {
            console.error('Error fetching medical records:', error);
        }
    }

    componentDidMount() {
        // Retrieve patient data from localStorage
        const storedPatient = localStorage.getItem('selectedPatient');
        if (storedPatient) {
            const patientData = JSON.parse(storedPatient);
            this.setState({ dataPatient: patientData });

            // Fetch medical records from API for the patient
            this.fetchMedicalRecords(patientData.patientId);
        } else {
            console.error('No patient data found in localStorage.');
        }

        // Fetch medicines list from API
        this.fetchAllMedicines();
    }

    handleDiagnosisChange = (e) => {
        this.setState({ diagnosis: e.target.value });
    }

    handleMedicineChange = (selectedMedicines) => {
        this.setState({ selectedMedicines });
    }

    handleNoteChange = (e) => {
        this.setState({ note: e.target.value });
    }

    // Hàm thêm kê đơn
    handleAddPrescription = async () => {
        const { diagnosis, selectedMedicines, note, dataPatient } = this.state;
        const selectedMedicineNames = selectedMedicines.map(med => med.label); // Lấy tên thuốc trực tiếp
    
        if (dataPatient && dataPatient.patientId) {
            console.log('Patient ID:', dataPatient.patientId);
        } else {
            console.error('No patient ID found');
            return;
        }
    
        try {
            const response = await addMedicalRecord({
                diagnosis,
                medicines: selectedMedicineNames, // Lưu tên thuốc thay vì ID hoặc JSON
                note,
                userId: dataPatient.patientId,
            });
    
            if (response && response.errCode === 0) {
                // Thông báo thành công
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Add Medical Record Successfully!',
                    showConfirmButton: false,
                    timer: 2000
                });
    
                // Gọi lại API để lấy danh sách hồ sơ bệnh án mới nhất từ database
                this.fetchMedicalRecords(dataPatient.patientId);
    
                // Reset lại giá trị các trường nhập
                this.setState({
                    diagnosis: '',
                    selectedMedicines: [],
                    note: ''
                });
    
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Unable to add medical record.',
                });
            }
        } catch (error) {
            console.error('Error adding medical record:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'An error occurred while adding the medical record.',
            });
        }
    }

    handleSortByDate = () => {
        const { medicalRecords, sortOrder } = this.state;
        let sortedRecords = [...medicalRecords];
    
        sortedRecords.sort((a, b) => {
            let dateA = new Date(a.createdAt);
            let dateB = new Date(b.createdAt);
    
            if (sortOrder === 'asc') {
                return dateA - dateB; // Sắp xếp tăng dần
            } else {
                return dateB - dateA; // Sắp xếp giảm dần
            }
        });
    
        this.setState({
            medicalRecords: sortedRecords,
            sortOrder: sortOrder === 'asc' ? 'desc' : 'asc', // Đổi trạng thái sắp xếp
        });
    };
    

    renderMedicalRecords = () => {
        const { medicalRecords } = this.state;
    
        if (medicalRecords.length === 0) {
            return <div>No medical records found.</div>;
        }
    
        return (
            <table className="table">
                <thead>
                    <tr>
                        <th>Diagnosis</th>
                        <th>Medicines</th>
                        <th>Note</th>
                        <th onClick={this.handleSortByDate} style={{ cursor: 'pointer' }}>
                            Created At (Date & Time) {/* Sắp xếp theo ngày và giờ */}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {medicalRecords.map((record, index) => {
                        let medicines = [];
    
                        if (Array.isArray(record.medicines)) {
                            medicines = record.medicines;
                        } else if (typeof record.medicines === 'string') {
                            try {
                                medicines = JSON.parse(record.medicines);
                                if (!Array.isArray(medicines)) {
                                    medicines = [];
                                }
                            } catch (error) {
                                console.error("Error parsing medicines:", error);
                                medicines = [];
                            }
                        }
    
                        return (
                            <tr key={index}>
                                <td>{record.diagnosis}</td>
                                <td>
                                    <ul>
                                        {medicines.map((medName, idx) => (
                                            <li key={idx}>{medName}</li>
                                        ))}
                                    </ul>
                                </td>
                                <td>{record.note}</td>
                                <td>{new Date(record.createdAt).toLocaleString()}</td> {/* Hiển thị ngày và giờ tạo */}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    };
    
    
    

    render() {
        const { dataPatient, diagnosis, selectedMedicines, note, medicineOptions } = this.state;
        const { user } = this.props;

        if (!dataPatient) {
            return <div>No patient data available.</div>;
        }

        const patient = dataPatient.patientData || {};
        const timeTypeData = dataPatient.timeTypeDataPatient || {};

        return (
            <>
                <Header />
                <div className="resume-wrapper">
                    <div className="container medical-layout">
                        <div className="patient-section">
                            <section className="profile section-padding">
                                <div className="profile-info">
                                    <div className="profile-details">
                                        <h1>{patient.firstName || 'N/A'} {patient.lastName || ''}</h1>
                                        <ul className="contact-info">
                                            <li><strong>Email:</strong> {patient.email || 'N/A'}</li>
                                            <li><strong>Gender:</strong> {patient.genderData ? patient.genderData.valueVi : 'N/A'}</li>
                                            <li><strong>Address:</strong> {patient.address || 'N/A'}</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            <section className="experience section-padding">
                                <div className="experience-info">
                                    <h3 className="experience-title">Appointment Time</h3>
                                    <p>Time: {timeTypeData.valueVi || 'N/A'}</p>
                                </div>
                            </section>
                        </div>

                        <div className="prescription-section">
                            <section className="prescription section-padding">
                                <h3 className="section-title">Diagnosis and Prescription</h3>
                                <div className="doctor-info">
                                    <h3>Doctor:</h3>
                                    {user ? (
                                        <p><strong>{user.firstName} {user.lastName}</strong></p>
                                    ) : (
                                        <p>Doctor information not available.</p>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label>Diagnosis</label>
                                    <textarea
                                        className="form-control"
                                        value={diagnosis}
                                        onChange={this.handleDiagnosisChange}
                                        placeholder="Enter diagnosis"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Prescription</label>
                                    <Select
                                        isMulti
                                        value={selectedMedicines}
                                        onChange={this.handleMedicineChange}
                                        options={medicineOptions}
                                        placeholder="Select medicines"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Notes</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={note}
                                        onChange={this.handleNoteChange}
                                        placeholder="Enter notes"
                                    />
                                </div>
                                <button className="btn btn-primary" onClick={this.handleAddPrescription}>
                                    Add Prescription
                                </button>
                            </section>
                        </div>

                        {/* Render the added medical records */}
                        {this.renderMedicalRecords()}
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        user: state.user.userInfor,
    };
};

export default withRouter(connect(mapStateToProps)(MedicalRecord));
