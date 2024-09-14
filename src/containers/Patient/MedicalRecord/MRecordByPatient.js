import React, { Component } from 'react';
import './MRecordByPatient.scss';
import { connect } from "react-redux";

class MRecordByPatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            medicalRecords: [],  // List of medical records for the patient
        };
    }

    async componentDidMount() {
        // Fetch medical records for the patient (example logic, replace with actual API call)
        const storedRecords = JSON.parse(localStorage.getItem('medicalRecords')) || [];
        this.setState({
            medicalRecords: storedRecords
        });
    }

    renderMedicalRecords = () => {
        const { medicalRecords } = this.state;

        if (medicalRecords.length === 0) {
            return <div>No medical records found.</div>;
        }

        return (
            <div className="medical-records-container">
                {medicalRecords.map((record, index) => (
                    <div key={index} className="medical-record-card">
                        <h2 className="record-title">Medical Record {index + 1}</h2>
                        <div className="record-details">
                            <p><strong>Chẩn đoán:</strong> {record.diagnosis}</p>
                            <p><strong>Thuốc đã kê:</strong></p>
                            <ul>
                                {record.medicines.map((med, idx) => (
                                    <li key={idx}>{med.label} - {med.composition}</li>
                                ))}
                            </ul>
                            <p><strong>Ghi chú:</strong> {record.note}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    render() {
        return (
            <div className="m-record-by-patient">
                <h1>Thông tin bệnh án của bệnh nhân</h1>
                {this.renderMedicalRecords()}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

export default connect(mapStateToProps)(MRecordByPatient);
