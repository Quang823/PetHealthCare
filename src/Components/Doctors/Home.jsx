import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { FaEye, FaStethoscope } from 'react-icons/fa';
import { Spinner } from 'react-bootstrap';
import Nav from './Nav';
import BookingDetailModal from './BookingDetailModal';
import MedicalHistoryModal from './MedicalHistoryModal';
import './Homee.scss';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

function Home({ Toggle }) {
    const [bookingDetails, setBookingDetails] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedBookingDetail, setSelectedBookingDetail] = useState(null);
    const [selectedMedicalHistory, setSelectedMedicalHistory] = useState(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showMedicalModal, setShowMedicalModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/doctor');
    };

    const fetchBookingDetails = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.User.map.userID; // Adjust this based on your token structure

            const res = await axios.get(`http://localhost:8080/bookingDetail/getAllBookingDetail_ByUserId?userId=${userId}`);
            setBookingDetails(res.data);
            console.log("bkdetail", res.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookingDetails();
    }, []);

    useEffect(() => {
        // Refetch booking details whenever selectedDate changes
        fetchBookingDetails();
    }, [selectedDate]);

    const handleViewDetail = (bookingDetail) => {
        setSelectedBookingDetail(bookingDetail);
        setShowBookingModal(true);
    };

    const handleExamine = async (bookingDetail) => {
        try {
            await axios.put(`http://localhost:8080/bookingDetail/update/status/${bookingDetail.bookingDetailId}`, { status: 'EXAMINING' });
            navigate('/examineDoctor', { state: { bookingDetail: { ...bookingDetail, booking: { ...bookingDetail.booking, status: 'EXAMINING' } } } });
        } catch (error) {
            console.error('Error updating status to Examining:', error);
        }
    };

    const handleViewMedicalHistory = async (bookingDetail) => {
        try {
            const res = await axios.get(`http://localhost:8080/medical-history/getMedicalHistoryByBookingDetailId/${bookingDetail.bookingDetailId}`);
            setSelectedMedicalHistory(res.data);
            setShowMedicalModal(true);
        } catch (error) {
            console.error('Error fetching medical history:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`; // YYYY-MM-DD format
        const formattedTime = `${hours}:${minutes}`; // HH:MM format

        return { formattedDate, formattedTime };
    };

    const isToday = (date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'CONFIRMED':
                return 'statuss-confirmed';
            case 'EXAMINING':
                return 'statuss-examining';
            case 'COMPLETED':
                return 'statuss-completed';
            case 'PAID':
                return 'statuss-paid';
            default:
                return '';
        }
    };

    const filteredBookingDetails = bookingDetails.filter(b => {
        const bookingDate = new Date(b.date);
        // Exclude CANCELLED bookings and include only bookings that are on the selected date
        return (
            bookingDate.toDateString() === selectedDate.toDateString() &&
            b.booking.status !== 'CANCELLED' &&
            b.status !== 'CANCELLED'
        );
    });

    return (

            <div className='bs-form'>
                <div className='headers'>
                    <h1>Doctor's Schedule</h1>
                </div>
                <div className='px-3'>
                    <Nav Toggle={Toggle} />
                    <div className='container-fluid'>
                        <div className='d-flex justify-content-between align-items-center'>
                            <h2 className="my-4">Schedule</h2>
                            <div className="d-flex align-items-center">
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={(date) => setSelectedDate(date)}
                                    dateFormat="dd MMMM yyyy"
                                    className="form-control"
                                />
                            </div>
                        </div>
                        {loading ? (
                            <div className="loading-indicator">
                                <Spinner animation="border" variant="primary" />
                            </div>
                        ) : (
                            <table className="table table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th>Owner Name</th>
                                        <th>Pet Type</th>
                                        <th>Pet Name</th>
                                        <th>Service Name</th>
                                        <th>Status booking</th>
                                        <th>Status</th>
                                        <th>Slot</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBookingDetails.length > 0 ? (
                                        filteredBookingDetails.map((detail, index) => {
                                            const { formattedDate, formattedTime } = formatDate(detail.date);
                                            const bookingDate = new Date(detail.date);
                                            return (
                                                <tr key={index}>
                                                    <td>{detail.pet.user.name}</td>
                                                    <td>{detail.pet.petType}</td>
                                                    <td>{detail.pet.petName}</td>
                                                    <td>{detail.services.name}</td>
                                                    <td className={getStatusClass(detail.booking.status)}>{detail.booking.status}</td>
                                                    <td className={getStatusClass(detail.status)}>{detail.status}</td>
                                                    <td>{`${detail.slot.startTime} - ${detail.slot.endTime}`}</td>
                                                    <td>
                                                        <button
                                                            className="bttn btn-primary"
                                                            onClick={() => handleExamine(detail)}
                                                            disabled={!isToday(bookingDate) || detail.status === 'COMPLETED'}
                                                        >
                                                            <FaStethoscope className='icoon' /> Examine
                                                        </button>
                                                        <button
                                                            className="bttn btn-info"
                                                            onClick={() => handleViewDetail(detail)}
                                                        >
                                                            <FaEye className='icoon' /> View
                                                        </button>
                                                        <button
                                                            className="bttn btn-secondary"
                                                            onClick={() => handleViewMedicalHistory(detail)}
                                                        >
                                                            <FaEye className='icoon' /> View Medical
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="no-bookings-message">
                                                No bookings for the selected date.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
                {showBookingModal && (
                    <BookingDetailModal
                        bookingDetail={selectedBookingDetail}
                        onClose={() => setShowBookingModal(false)}
                    />
                )}
                {showMedicalModal && (
                    <MedicalHistoryModal
                        show={showMedicalModal}
                        onHide={() => setShowMedicalModal(false)}
                        medicalHistory={selectedMedicalHistory}
                    />
                )}
                <button className="back-button" onClick={handleBack}>Back</button>
            </div>

    );
}

export default Home;
