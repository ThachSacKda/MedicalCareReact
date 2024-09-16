import React, { Component } from 'react';
import './MRecordByPatient.scss';
import { connect } from "react-redux";
import { getMedicalRecordsByPatientId } from '../../../services/userService';
import HomeHeader from '../../HomePage/HomeHeader';

class MRecordByPatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            medicalRecords: [],  // List of medical records for the patient
            patientId: this.props.patientId || 28,  // Assume patientId is passed from props
        };
    }

    async componentDidMount() {
        const patientId = this.props.match.params.patientId || this.state.patientId;

        console.log("Patient ID:", patientId);

        if (patientId) {
            try {
                let response = await getMedicalRecordsByPatientId(patientId);
                console.log("API Response:", response.data);

                if (response && response.data) {
                    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                        this.setState({
                            medicalRecords: response.data
                        });
                    } else {
                        console.error("No medical records found.");
                    }
                } else {
                    console.error("Error fetching medical records:", response.errMessage);
                }
            } catch (error) {
                console.error("Error fetching medical records:", error);
            }
        } else {
            console.error("Patient ID not found.");
        }
    }

    renderMedicines = (medicines) => {
        try {
            if (typeof medicines === 'string') {
                let cleanedMedicines = medicines.replace(/\\/g, '').replace(/^"(.*)"$/, '$1');
                let parsedMedicines = JSON.parse(cleanedMedicines);

                if (Array.isArray(parsedMedicines)) {
                    return parsedMedicines.map((med, idx) => <li key={idx}>{med}</li>);
                }
            } else if (Array.isArray(medicines)) {
                return medicines.map((med, idx) => <li key={idx}>{med}</li>);
            }
        } catch (error) {
            console.error("Error parsing medicines:", error);
        }

        return <li>No medicines found</li>;
    };

    renderMedicalRecordTable = () => {
        const { medicalRecords } = this.state;

        if (!Array.isArray(medicalRecords) || medicalRecords.length === 0) {
            return <div>No medical records found.</div>;
        }

        return (
            <table className="medical-record-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Chẩn đoán</th>
                        <th>Thuốc đã kê</th>
                        <th>Ghi chú</th>
                        <th>Tên Bệnh Nhân</th>
                    </tr>
                </thead>
                <tbody>
                    {medicalRecords.map((record, index) => (
                        <tr key={index}>
                            <td>{record.id}</td>
                            <td>{record.diagnosis}</td>
                            <td>
                                <ul>
                                    {this.renderMedicines(record.medicines)}
                                </ul>
                            </td>
                            <td>{record.note}</td>
                            <td>{record.patient ? `${record.patient.firstName} ${record.patient.lastName}` : 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    render() {
        return (
            <div className="m-record-by-patient">
                <HomeHeader/>
                <h1>Thông tin bệnh án của bệnh nhân</h1>
                {this.renderMedicalRecordTable()}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        patientId: state.user.patientId
    };
};

export default connect(mapStateToProps)(MRecordByPatient);
