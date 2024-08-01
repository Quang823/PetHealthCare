import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { FaEye, FaStethoscope, FaTimes } from 'react-icons/fa';
import { Spinner } from 'react-bootstrap';
import Nav from './Nav';
import BookingDetailModal from './BookingDetailModal';
import './Homee.scss';
import {jwtDecode} from 'jwt-decode';
import { toast } from 'react-toastify';

function Home({ Toggle }) {
    const [bookingDetails, setBookingDetails] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedBookingDetail, setSelectedBookingDetail] = useState(null);
    const [showModal, setShowModal] = useState(false);
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
        setShowModal(true);
    };

    const handleExamine = async (bookingDetail) => {
        try {
            await axios.put(`http://localhost:8080/bookingDetail/update/status/${bookingDetail.bookingDetailId}`, { status: 'EXAMINING' });
            navigate('/examineDoctor', { state: { bookingDetail: { ...bookingDetail, booking: { ...bookingDetail.booking, status: 'EXAMINING' } } } });
        } catch (error) {
            console.error('Error updating status to Examining:', error);
        }
    };

    const handleCancelSlot = async () => {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        const token = localStorage.getItem('token');
    
        try {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.User.map.userID;
    
            console.log('Sending request with:', { dateTime: formattedDate, vetId: userId });
    
            const response = await axios.get('http://localhost:8080/bookingDetail/vetCancelBookingDetail/', {
                params: {
                    dateTime: formattedDate,
                    vetId: userId
                }
            });
    
            console.log('Server response:', response.data);
    
            if (response.data.status === "ok") {
                setBookingDetails(prevDetails =>
                    prevDetails.map(detail =>
                        detail.date === formattedDate
                            ? { ...detail, vetCancelled: true }
                            : detail
                    )
                );
                toast.success(response.data.message || 'Slot has been successfully cancelled');
                fetchBookingDetails(); // Refresh booking details
            } else {
                toast.error(response.data.message || 'Failed to cancel the slot');
            }
        } catch (error) {
            console.error('Error cancelling slot:', error);
            if (error.response) {
                console.error('Server responded with:', error.response.data);
                console.error('Status code:', error.response.status);
                toast.error(error.response.data.message || 'Failed to cancel the slot. Please try again.');
            } else {
                toast.error('An error occurred while cancelling the slot. Please try again.');
            }
        }
    };
    

    const filteredBookingDetails = bookingDetails.filter(b => {
        const bookingDate = new Date(b.date);
        return bookingDate.toDateString() === selectedDate.toDateString();
    });

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
                return 'status-confirmed';
            case 'EXAMINING':
                return 'status-examining';
            case 'COMPLETED':
                return 'status-examcompleted';
            default:
                return '';
        }
    };

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
                                {/* <button
                                    className="bttn btn-danger ms-3"
                                    onClick={handleCancelSlot}
                                >
                                    <FaTimes className='icoon' /> Cancel Slot
                                </button> */}
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
                                                            disabled={!isToday(bookingDate) || detail.status === 'Completed'}
                                                        >
                                                            <FaStethoscope className='icoon' /> Examine
                                                        </button>
                                                        <button
                                                            className="bttn btn-info"
                                                            onClick={() => handleViewDetail(detail)}
                                                        >
                                                            <FaEye className='icoon' /> View
                                                        </button>
                                                        {/* <button
                                                            className="bttn btn-danger"
                                                            onClick={() => handleCancelSlot(detail)}
                                                            disabled={detail.vetCancelled}
                                                        >
                                                            <FaTimes className='icoon' /> {detail.vetCancelled ? 'Cancelled' : 'Cancel Slot'}
                                                        </button> */}
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
                {showModal && (
                    <BookingDetailModal
                        bookingDetail={selectedBookingDetail}
                        onClose={() => setShowModal(false)}
                    />
                )}
                <button className="back-button" onClick={handleBack}>Back</button>
            </div>

    );
}

export default Home;
