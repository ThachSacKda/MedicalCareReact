import React, { Component } from 'react';
import './MedicalRecord.scss';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom'; 
import Select from 'react-select'; 


class MedicalRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataPatient: null,  // Lưu trữ thông tin bệnh nhân
            diagnosis: '',  // Lưu chẩn đoán
            selectedMedicines: [],  // Lưu danh sách thuốc được chọn
            note: '',  // Lưu ghi chú
        };
    }

    componentDidMount() {
        // Lấy dữ liệu từ localStorage
        const storedPatient = localStorage.getItem('selectedPatient');
        if (storedPatient) {
            this.setState({
                dataPatient: JSON.parse(storedPatient)  
            });
        } else {
            console.error('No patient data found in localStorage.');
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

    handleAddPrescription = () => {
        const { diagnosis, selectedMedicines, note } = this.state;
        console.log('Diagnosis:', diagnosis);
        console.log('Medicines:', selectedMedicines);
        console.log('Note:', note);
        alert('Prescription added!');
    }

    render() {
        const { dataPatient, diagnosis, selectedMedicines, note } = this.state;

        if (!dataPatient) {
            return <div>Không có dữ liệu bệnh nhân.</div>;  
        }
        const patient = dataPatient.patientData || {}; 
        const timeTypeData = dataPatient.timeTypeDataPatient || {}; 

        // Các tùy chọn thuốc cho React Select
        const medicineOptions = [
            { value: 'med1', label: 'Paracetamol' },
            { value: 'med2', label: 'Amoxicillin' },
            { value: 'med3', label: 'Ibuprofen' },
            { value: 'med4', label: 'Metformin' }
        ];

        return (
            <div className="resume-wrapper">
    <div className="container">
        <div className="row">
            <section className="profile section-padding col-lg-6">
                <div className="profile-info">
                    <div className="profile-avatar">
                        <img src={patient.image} alt="Patient Avatar" className="avatar" />
                    </div>
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

            <section className="experience section-padding col-lg-6">
                <div className="experience-info">
                    <h3 className="experience-title">Thông tin giờ khám</h3>
                    <p>Giờ khám: {timeTypeData.valueVi || 'N/A'}</p>
                </div>
            </section>
        </div>
    </div>

    <section className="prescription section-padding">
        <div className="container">
            <h3 className="section-title">Chẩn đoán và kê thuốc</h3>
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
        </div>
    </section>
</div>


        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        user: state.user.userInfor,
    };
};

// Bọc component với withRouter để có thể sử dụng history.push()
export default withRouter(connect(mapStateToProps)(MedicalRecord));
