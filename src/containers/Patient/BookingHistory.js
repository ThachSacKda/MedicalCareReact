import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBookingHistoryByPatientId } from '../../services/userService';
import './BookingHistory.scss';
import HomeHeader from '../HomePage/HomeHeader';
import { FormattedMessage } from 'react-intl';

const BookingHistory = () => {
    const { patientId } = useParams();
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

    const handleCancelBooking = (bookingId) => {
        // TODO: Implement the cancel booking functionality
        alert(`Booking with ID ${bookingId} has been canceled.`);
    };

    if (loading) return <p>Loading data...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="booking-history-page">
            <HomeHeader />
            <div className="booking-history-container">
                <h2><FormattedMessage id="common.history"/></h2>
                {Array.isArray(bookingHistory) && bookingHistory.length === 0 ? (
                    <p>No booking history found.</p>
                ) : (
                    <>
                        <table className="booking-history-table">
                            <thead>
                                <tr>
                                    <th><FormattedMessage id="common.No"/> </th>
                                    <th><FormattedMessage id="common.Date"/> </th>
                                    <th><FormattedMessage id="common.Status"/> </th>
                                    <th><FormattedMessage id="common.Time"/> </th>
                                    <th><FormattedMessage id="common.Name"/> </th>
                                    <th><FormattedMessage id="common.Action"/></th>
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
                                        <td>
                                            <button
                                                className="cancel-button"
                                                onClick={() => handleCancelBooking(booking.id)}
                                            >
                                                Cancel
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className="warning-text">
                            <FormattedMessage id="common.warningtext"/> 
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default BookingHistory;
