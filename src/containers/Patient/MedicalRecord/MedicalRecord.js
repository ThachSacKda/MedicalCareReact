import React, { Component } from 'react';
import './MedicalRecord.scss';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import Select from 'react-select';
import { getAllMedicines, addMedicalRecord } from '../../../services/userService';  // Import API calls
import Header from '../../Header/Header';

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
            addedMedicines: [], // Store medicines after being added
        };
    }

    componentDidMount() {
        // Retrieve patient data from localStorage
        const storedPatient = localStorage.getItem('selectedPatient');
        if (storedPatient) {
            const patientData = JSON.parse(storedPatient);
            console.log('Retrieved patient data:', patientData); // Debugging line
            this.setState({
                dataPatient: patientData  // Store patient data in state
            });
        } else {
            console.error('No patient data found in localStorage.');
        }

        // Fetch medicines list from API
        this.fetchAllMedicines();
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

    handleDiagnosisChange = (e) => {
        this.setState({ diagnosis: e.target.value });
    }

    handleMedicineChange = (selectedMedicines) => {
        this.setState({ selectedMedicines });
    }

    handleNoteChange = (e) => {
        this.setState({ note: e.target.value });
    }

    handleAddPrescription = async () => {
        const { diagnosis, selectedMedicines, note, dataPatient } = this.state;
        const selectedMedicineIds = selectedMedicines.map(med => med.value);
    
        if (dataPatient && dataPatient.patientId) {
            console.log('Patient ID:', dataPatient.patientId);  // Log the patient ID
        } else {
            console.error('No patient ID found');
            return; // Stop execution if no patientId is found
        }
    
        try {
            const response = await addMedicalRecord({
                diagnosis,
                medicines: selectedMedicineIds,
                note,
                userId: dataPatient.patientId,  // Send the patient ID
            });
    
            if (response && response.errCode === 0) {
                alert('Medical record added successfully!');
                
                // After successfully adding the record, navigate to the MRecordByPatient page
                this.props.history.push(`/medical-record-by-patient/${dataPatient.patientId}`);  // Use patientId to navigate
            } else {
                alert('Failed to add medical record');
            }
        } catch (error) {
            console.error('Error adding medical record:', error);
        }
    }
    

    // Render selected medicines table
    renderSelectedMedicines = () => {
        const { addedMedicines, medicineOptions } = this.state;

        if (addedMedicines.length === 0) {
            return null; // No medicines added yet
        }

        return (
            <div className="added-medicines">
                <h3>Thuốc đã kê</h3>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Tên thuốc</th>
                            <th>Thành phần</th>
                            <th>Công dụng</th>
                            <th>Tác dụng phụ</th>
                            <th>Nhà sản xuất</th>
                        </tr>
                    </thead>
                    <tbody>
                        {addedMedicines.map((med, index) => {
                            const medicineDetail = medicineOptions.find(option => option.value === med.value);
                            return (
                                <tr key={index}>
                                    <td>{medicineDetail ? medicineDetail.label : ''}</td>
                                    <td>{medicineDetail ? medicineDetail.composition : ''}</td>
                                    <td>{medicineDetail ? medicineDetail.uses : ''}</td>
                                    <td>{medicineDetail ? medicineDetail.sideEffects : ''}</td>
                                    <td>{medicineDetail ? medicineDetail.manufacturer : ''}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }

    render() {
        const { dataPatient, diagnosis, selectedMedicines, note, medicineOptions } = this.state;
        const { user } = this.props; // Access the logged-in user's information (doctor)

        if (!dataPatient) {
            return <div>Không có dữ liệu bệnh nhân.</div>;
        }

        // Use patient.patientData for patient details
        const patient = dataPatient.patientData || {};
        const timeTypeData = dataPatient.timeTypeDataPatient || {};

        console.log('user:', user)

        return (
            <>
                <Header />
                <div className="resume-wrapper">
                    <div className="container medical-layout">
                        {/* Patient Details Section */}
                        <div className="patient-section">
                            <section className="profile section-padding">
                                <div className="profile-info">
                                    <div className="profile-details">
                                        <h1>{patient.firstName || 'N/A'} {patient.lastName || ''}</h1>
                                        <ul className="contact-info">
                                            <li><strong>Email:</strong> {patient.email || 'N/A'}</li>
                                            <li><strong>Giới Tính:</strong> {patient.genderData ? patient.genderData.valueVi : 'N/A'}</li>
                                            <li><strong>Địa chỉ:</strong> {patient.address || 'N/A'}</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            <section className="experience section-padding">
                                <div className="experience-info">
                                    <h3 className="experience-title">Thông tin giờ khám</h3>
                                    <p>Giờ khám: {timeTypeData.valueVi || 'N/A'}</p>
                                </div>
                            </section>
                        </div>

                        {/* Prescription Section */}
                        <div className="prescription-section">
                            <section className="prescription section-padding">
                                <h3 className="section-title">Chẩn đoán và kê thuốc</h3>
                                {/* Doctor Information */}
                                <div className="doctor-info">
                                    <h3>Bác sĩ thực hiện chẩn đoán và kê thuốc:</h3>
                                    {user ? (
                                        <>
                                            <p>Tên bác sĩ: <strong>{user.firstName} {user.lastName}</strong></p>
                                        </>
                                    ) : (
                                        <p>Thông tin bác sĩ không khả dụng.</p>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label>Chẩn đoán</label>
                                    <textarea
                                        className="form-control"
                                        value={diagnosis}
                                        onChange={this.handleDiagnosisChange}
                                        placeholder="Nhập chẩn đoán"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Kê thuốc</label>
                                    <Select
                                        isMulti
                                        value={selectedMedicines}
                                        onChange={this.handleMedicineChange}
                                        options={medicineOptions}
                                        placeholder="Chọn thuốc"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Ghi chú</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={note}
                                        onChange={this.handleNoteChange}
                                        placeholder="Nhập ghi chú"
                                    />
                                </div>
                                <button className="btn btn-primary" onClick={this.handleAddPrescription}>
                                    Thêm kê đơn
                                </button>
                            </section>
                        </div>

                        {/* Render selected medicines and their details */}
                        {this.renderSelectedMedicines()}
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        user: state.user.userInfor, // Access the logged-in user's info from Redux
    };
};

export default withRouter(connect(mapStateToProps)(MedicalRecord));
