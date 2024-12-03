// PatientProfile.js
import React, { Component } from 'react';
import './PatientProfile.scss';
import { withRouter } from 'react-router-dom';
import { getPatientProfileById } from '../../../services/userService'; // Import API call
import HomeHeader from '../../HomePage/HomeHeader';
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';


class PatientProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            patientInfo: null,  // Store patient data
            imageSrc: '',       // Store the image source (Base64 or URL)
            sortOrder: 'asc',   // Default sort order (ascending)
        };

        this.fetchPatientProfile = this.fetchPatientProfile.bind(this);
        this.handleSortByCreatedAt = this.handleSortByCreatedAt.bind(this); // Bind the sort handler
    }

    // Helper function to convert binary data to Base64
    arrayBufferToBase64(buffer) {
        let binary = '';
        let bytes = new Uint8Array(buffer);
        let len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    fetchPatientProfile = async (patientId) => {
        try {
            const response = await getPatientProfileById(patientId);

            if (response && response.errCode === 0) {
                const patientInfo = response.data.patientInfo;
                let imageSrc = '';

                if (patientInfo.image && patientInfo.image.data) {
                    imageSrc = `data:image/jpeg;base64,${this.arrayBufferToBase64(patientInfo.image.data)}`;
                }

                this.setState({ patientInfo, imageSrc });
            } else {
                console.error('Failed to fetch patient profile');
            }
        } catch (error) {
            console.error('Error fetching patient profile:', error);
        }
    };

    componentDidMount() {
        const patientId = this.props.match.params.id; // Get the patient ID from URL parameters

        if (patientId) {
            this.fetchPatientProfile(patientId); // Fetch the profile using the ID from the URL
        } else {
            console.error('No patient ID found in URL.');
        }
    }

    handleSortByCreatedAt() {
        const { sortOrder } = this.state;
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        this.setState({ sortOrder: newSortOrder });
    }

    renderMedicalRecords = () => {
        const { patientInfo, sortOrder } = this.state;

        if (!patientInfo || !patientInfo.medicalRecords || patientInfo.medicalRecords.length === 0) {
            return <div>No medical records found.</div>;
        }

        const sortedRecords = [...patientInfo.medicalRecords].sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });

        return (
            <table className="table">
                <thead>
                    <tr>
                        <th><FormattedMessage id="title.Diagnosis" /></th>
                        <th><FormattedMessage id="title.Medicines" /></th>
                        <th><FormattedMessage id="title.Note" /></th>
                        <th onClick={this.handleSortByCreatedAt} style={{ cursor: 'pointer' }}>
                        <FormattedMessage id="title.time" /> {sortOrder === 'asc' ? '↑' : '↓'}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedRecords.map((record, index) => {
                        let medicinesArray = [];
                        try {
                            medicinesArray = JSON.parse(record.medicines);
                        } catch (error) {
                            console.error('Failed to parse medicines:', error);
                        }

                        return (
                            <tr key={index}>
                                <td>{record.diagnosis}</td>
                                <td>
                                    <ul>
                                        {Array.isArray(medicinesArray) ? (
                                            medicinesArray.map((med, idx) => (
                                                <li key={idx}>{med}</li>
                                            ))
                                        ) : (
                                            <li>No medicines listed</li>
                                        )}
                                    </ul>
                                </td>
                                <td>{record.note}</td>
                                <td>{new Date(record.createdAt).toLocaleString()}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    };

    render() {
        const { patientInfo, imageSrc } = this.state;

        if (!patientInfo) {
            return <div>Loading patient profile...</div>;
        }

        return (
            <div>
                <HomeHeader />
                <div className="patient-profile-wrapper">
                    <div className="patient-info">
                        <h1>{patientInfo.firstName || 'No First Name'} {patientInfo.lastName || 'No Last Name'}</h1>
                        <p><strong><FormattedMessage id="title.Email" />:</strong> {patientInfo.email || 'No Email'}</p>
                        <p><strong><FormattedMessage id="title.Gender" />:</strong> {patientInfo.gender === 'M' ? 'Male' : 'Female'}</p>
                        <p><strong><FormattedMessage id="title.Address" />:</strong> {patientInfo.address || 'No Address'}</p>
                    </div>

                    <div className="medical-records-section">
                        <h2><FormattedMessage id="title.medicalrecord" /></h2>
                        {this.renderMedicalRecords()}
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(PatientProfile);
