import React, { Component } from 'react';
import './PatientProfile.scss';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import { getPatientProfileById } from '../../../services/userService'; // Import API call
import HomeHeader from '../../HomePage/HomeHeader';

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

    // Convert buffer array to Base64
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
            console.log("API Response: ", response); // Log the API response

            if (response && response.errCode === 0) {
                const patientInfo = response.data.patientInfo;

                // Convert image buffer to Base64
                let imageSrc = '';
                if (patientInfo.image && patientInfo.image.data) {
                    imageSrc = `data:image/jpeg;base64,${this.arrayBufferToBase64(patientInfo.image.data)}`;
                }

                this.setState({ patientInfo, imageSrc });
                console.log("Patient Info: ", patientInfo); // Log the patient data to see the structure
            } else {
                console.error('Failed to fetch patient profile');
            }
        } catch (error) {
            console.error('Error fetching patient profile:', error);
        }
    };

    componentDidMount() {
        const { userInfor } = this.props;

        if (userInfor && userInfor.id) {
            this.fetchPatientProfile(userInfor.id); // Fetch the profile using the logged-in user's ID
        } else {
            console.error('No user ID found for the logged-in user.');
        }
    }

    // Sort handler for "Created Time"
    handleSortByCreatedAt() {
        const { sortOrder } = this.state;
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc'; // Toggle between ascending and descending
        this.setState({ sortOrder: newSortOrder });
    }

    renderMedicalRecords = () => {
        const { patientInfo, sortOrder } = this.state;

        if (!patientInfo || !patientInfo.medicalRecords || patientInfo.medicalRecords.length === 0) {
            return <div>No medical records found.</div>;
        }

        // Sort medical records based on the createdAt field
        const sortedRecords = [...patientInfo.medicalRecords].sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA; // Sort based on the sortOrder
        });

        return (
            <table className="table">
                <thead>
                    <tr>
                        <th>Diagnosis</th>
                        <th>Medicines</th>
                        <th>Note</th>
                        <th onClick={this.handleSortByCreatedAt} style={{ cursor: 'pointer' }}>
                            Created Time {sortOrder === 'asc' ? '↑' : '↓'} {/* Show arrow based on sort order */}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedRecords.map((record, index) => {
                        // Parse medicines if it's stored as a string
                        let medicinesArray = [];
                        try {
                            medicinesArray = JSON.parse(record.medicines); // Attempt to parse medicines
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
                        <div
                            className="patient-photo"
                            style={{
                                backgroundImage: imageSrc ? `url(${imageSrc})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                width: '150px',
                                height: '150px',
                                borderRadius: '50%',
                            }}
                        >
                            {/* Fallback content */}
                            {!imageSrc && <span className="no-photo">No Photo</span>}
                        </div>

                        <h1>{patientInfo.firstName || 'No First Name'} {patientInfo.lastName || 'No Last Name'}</h1>
                        <p><strong>Email:</strong> {patientInfo.email || 'No Email'}</p>
                        <p><strong>Gender:</strong> {patientInfo.gender === 'M' ? 'Male' : 'Female'}</p>
                        <p><strong>Address:</strong> {patientInfo.address || 'No Address'}</p>
                    </div>


                    <div className="medical-records-section">
                        <h2>Medical Records</h2>
                        {this.renderMedicalRecords()}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        userInfor: state.user.userInfor, // Get the logged-in user information from Redux store
        language: state.app.language,
    };
};

export default withRouter(connect(mapStateToProps)(PatientProfile));
