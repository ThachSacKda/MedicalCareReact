import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBookingHistoryByPatientId, deleteBookingById } from '../../services/userService';
import './BookingHistory.scss';
import HomeHeader from '../HomePage/HomeHeader';
import { FormattedMessage } from 'react-intl';

const BookingHistory = () => {
    const { patientId } = useParams();
    const [bookingHistory, setBookingHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false); // Track modal visibility
    const [selectedBookingId, setSelectedBookingId] = useState(null); // Track selected booking for cancellation

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

    const openCancelModal = (bookingId) => {
        setSelectedBookingId(bookingId);
        setShowModal(true);
    };

    const closeCancelModal = () => {
        setSelectedBookingId(null);
        setShowModal(false);
    };

    const handleConfirmCancel = async () => {
        try {
            const response = await deleteBookingById(selectedBookingId);
            if (response.data.errCode === 0) {
                alert("Booking canceled successfully.");
                setBookingHistory(prevHistory => prevHistory.filter(booking => booking.id !== selectedBookingId));
            } else {
                alert(response.data.errMessage || "Error canceling booking.");
            }
        } catch (error) {
            alert("Error canceling booking.");
            console.error("Error canceling booking:", error);
        } finally {
            closeCancelModal();
        }
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
                                        <td>{index + 1}</td>
                                        <td>{formatDate(booking.date)}</td>
                                        <td>{booking.statusId === 'S2' ? 'Confirmed' : 'Pending'}</td>
                                        <td>{booking.timeTypeDataPatient?.valueVi || booking.timeType}</td>
                                        <td>{`${booking.patientData?.firstName || ''} ${booking.patientData?.lastName || ''}`}</td>
                                        <td>
                                            <button
                                                className="cancel-button"
                                                onClick={() => openCancelModal(booking.id)}
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

                {/* Modal for Confirmation */}
                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>Confirm Cancellation</h3>
                            <p>Are you sure you want to cancel this booking?</p>
                            <div className="modal-buttons">
                                <button onClick={handleConfirmCancel} className="confirm-button">Yes</button>
                                <button onClick={closeCancelModal} className="cancel-modal-button">No</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingHistory;
