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
        if (bookingDetail.booking.status === 'Completed') {
            alert('This booking has already been completed. Please select another booking for examination.');
            return;
        }

        try {
            await axios.put(`http://localhost:8080/bookingDetail/update/status/${bookingDetail.bookingDetailId}`, { status: 'Examining' });
            navigate('/examineDoctor', { state: { bookingDetail: { ...bookingDetail, booking: { ...bookingDetail.booking, status: 'Examining' } } } });
        } catch (error) {
            console.error('Error updating status to Examining:', error);
        }
    };

    const handleCancelSlot = async (bookingDetail) => {
        const { bookingDetailId, date, vetCancelled } = bookingDetail;
    
        if (vetCancelled) {
            toast.error('This slot has already been cancelled.');
            return;
        }
    
        const formattedDate = new Date(date).toISOString().split('T')[0];
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
                        detail.bookingDetailId === bookingDetailId
                            ? { ...detail, vetCancelled: true }
                            : detail
                    )
                );
                toast.success(response.data.message || 'Slot has been successfully cancelled');
                fetchBookingDetails();
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
        const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const optionsTime = { hour: '2-digit', minute: '2-digit' };
        const formattedDate = date.toLocaleDateString('en-GB', optionsDate);
        const formattedTime = date.toLocaleTimeString('en-GB', optionsTime);
        return { formattedDate, formattedTime };
    };

    const isToday = (date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Confirmed':
                return 'status-confirmed';
            case 'Examining':
                return 'status-examining';
            case 'Completed':
                return 'status-examcompleted';
            default:
                return '';
        }
    };

    return (
        <>
            <div className='bs-form'>
                <div className='headers'>
                    <h1>Doctor's Schedule</h1>
                </div>
                <div className='px-3'>
                    <Nav Toggle={Toggle} />
                    <div className='container-fluid'>
                        <div className='d-flex justify-content-between align-items-center'>
                            <h2 className="my-4">Schedule</h2>
                            <div className="date-picker">
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
                                                        <button
                                                            className="bttn btn-danger"
                                                            onClick={() => handleCancelSlot(detail)}
                                                            disabled={detail.vetCancelled}
                                                        >
                                                             <FaTimes className='icoon' /> {detail.vetCancelled ? 'Cancelled' : 'Cancel Slot'}
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
                {showModal && (
                    <BookingDetailModal
                        bookingDetail={selectedBookingDetail}
                        onClose={() => setShowModal(false)}
                    />
                )}
            </div>
        </>
    );
}

export default Home;
