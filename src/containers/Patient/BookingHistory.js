import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import { getBookingHistoryByPatientId } from '../../services/userService';
import './BookingHistory.scss';
import HomeHeader from '../HomePage/HomeHeader';

const BookingHistory = () => {
    const { patientId } = useParams(); // Use useParams to get patientId
    const [bookingHistory, setBookingHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookingHistory = async () => {
            try {
                const response = await getBookingHistoryByPatientId(patientId);
                console.log("API Response:", response);

                if (response && response.errCode === 0) {
                    setBookingHistory(response.data);
                } else {
                    setError(response.errMessage || 'Error occurred');
                }
            } catch (err) {
                setError('Unable to load booking history');
            } finally {
                setLoading(false);
            }
        };

        fetchBookingHistory();
    }, [patientId]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    if (loading) return <p>Loading data...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="booking-history-page">
            <HomeHeader />
            <div className="booking-history-container">
                <h2>Booking History</h2>
                {Array.isArray(bookingHistory) && bookingHistory.length === 0 ? (
                    <p>No booking history found.</p>
                ) : (
                    <table className="booking-history-table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Time</th>
                                <th>Patient Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(bookingHistory) && bookingHistory.map((booking, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td> {/* Display index starting from 1 */}
                                    <td>{formatDate(booking.date)}</td>
                                    <td>{booking.statusId === 'S2' ? 'Confirmed' : 'Pending'}</td>
                                    <td>{booking.timeTypeDataPatient?.valueVi || booking.timeType}</td>
                                    <td>{`${booking.patientData?.firstName || ''} ${booking.patientData?.lastName || ''}`}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default BookingHistory;
