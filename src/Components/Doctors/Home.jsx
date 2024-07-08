import React, { useEffect, useState } from 'react';
import Nav from './Nav';
import { useNavigate } from "react-router-dom";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Homee.scss';
import axios from 'axios';
import BookingDetailModal from './BookingDetailModal';
import { FaEye, FaStethoscope } from 'react-icons/fa';
import { Spinner } from 'react-bootstrap';

function Home({ Toggle }) {
    const [booking, setBooking] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedBookingDetail, setSelectedBookingDetail] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/doctor');
    };

    useEffect(() => {
        fetchBooking();
    }, []);

    const fetchBooking = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:8080/booking/getAll");
            setBooking(res.data);
            setLoading(false);
        } catch (er) {
            console.log(er);
            setLoading(false);
        }
    };

    const handleViewDetail = async (bookingId) => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:8080/bookingDetail/getAll?bookingId=${bookingId}`);
            setSelectedBookingDetail(res.data[0]); // Assuming only one booking detail per booking
            setShowModal(true);
            setLoading(false);
        } catch (er) {
            console.log(er);
            setLoading(false);
        }
    };

    const filteredBookings = booking.filter(b => {
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

    return (
        <>
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
                                    <th>BookingId</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                    <th>Total Price</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.length > 0 ? (
                                    filteredBookings.map((user, index) => {
                                        const { formattedDate, formattedTime } = formatDate(user.date);
                                        return (
                                            <tr key={index}>
                                                <td>{user.bookingId}</td>
                                                <td>{formattedDate}</td>
                                                <td>{formattedTime}</td>
                                                <td className={user.status === 'Confirmed' ? 'status-confirmed' : ''}>{user.status}</td>
                                                <td>{user.totalPrice}</td>
                                                <td>
                                                    <button className="bttn btn-primary">
                                                        <FaStethoscope className='icoon' /> Examine
                                                    </button>
                                                    <button
                                                        className="bttn btn-info"
                                                        onClick={() => handleViewDetail(user.bookingId)}
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

        </>
    );
}
export default Home;
