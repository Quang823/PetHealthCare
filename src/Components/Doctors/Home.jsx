import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { FaEye, FaStethoscope } from 'react-icons/fa';
import { Spinner } from 'react-bootstrap';
import Nav from './Nav';
import BookingDetailModal from './BookingDetailModal';
import './Homee.scss'; // Ensure this file is correctly imported and exists
import { jwtDecode } from "jwt-decode";

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

    useEffect(() => {
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

        fetchBookingDetails();
    }, []);

    const handleViewDetail = (bookingDetail) => {
        setSelectedBookingDetail(bookingDetail);
        setShowModal(true);
    };

    const handleExamine = (bookingDetail) => {
        navigate('/examineDoctor', { state: { bookingDetail } });
    };

    const filteredBookingDetails = bookingDetails.filter(b => {
        const bookingDate = new Date(b.date);
        return bookingDate.toDateString() === selectedDate.toDateString() && b.booking.status === 'Confirmed';
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const optionsTime = { hour: '2-digit', minute: '2-digit' };
        const formattedDate = date.toLocaleDateString('en-GB', optionsDate);
        const formattedTime = date.toLocaleTimeString('en-GB', optionsTime);
        return { formattedDate, formattedTime };
    };

   
    return (
     
        <>
           <div classname='bs-form'>
            <div className='headers'>
                <h1>Doctor's Schedule</h1>
            </div>
            <div className='px-3'>
                {/* <Nav Toggle={Toggle} /> */}
                <div className='container-fluid'>
                    <div className='d-flex justify-content-between align-items-center'>
                        <h2 className="my-4">Schedule</h2>
                        <div className="date-picker">
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                                minDate={new Date()}
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
                                    <th>Slot</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookingDetails.length > 0 ? (
                                    filteredBookingDetails.map((detail, index) => {
                                        const { formattedDate, formattedTime } = formatDate(detail.date);
                                        return (
                                            <tr key={index}>
                                                <td>{detail.pet.user.name}</td>
                                                <td>{detail.pet.petType}</td>
                                                <td>{detail.pet.petName}</td>
                                                <td>{detail.services.name}</td>
                                                <td>{`${detail.slot.startTime} - ${detail.slot.endTime}`}</td>
                                                <td>
                                                    <button
                                                        className="bttn btn-primary"
                                                        onClick={() => handleExamine(detail)}
                                                    >
                                                        <FaStethoscope className='icoon' /> Examine
                                                    </button>
                                                    <button
                                                        className="bttn btn-info"
                                                        onClick={() => handleViewDetail(detail)}
                                                    >
                                                        <FaEye className='icoon' /> View
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="no-bookings-message">
                                            No confirmed bookings for the selected date.
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
