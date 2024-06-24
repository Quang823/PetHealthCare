import React, { useEffect, useState } from 'react';
import Nav from './Nav';
import { Link, useNavigate } from "react-router-dom";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Homee.scss';
import axios from 'axios';
import BookingDetailModal from './BookingDetailModal';

function Home({ Toggle }) {
    const [booking, setBooking] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedBookingDetail, setSelectedBookingDetail] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/doctor');
    };

    useEffect(() => {
        fetchBooking();
    }, []);
    // useEffect(() => {
    //     fetchBooking(selectedDate);
    // }, [selectedDate]);

    // const fetchBooking = async (date) => {
    //     try {
    //         const formattedDate = date.toISOString().split('T')[0]; // Format date to YYYY-MM-DD
    //         const res = await axios.get(`http://localhost:8080/booking/getByDate?date=${formattedDate}`);
    //         setBooking(res.data);
    //     } catch (er) {
    //         console.log(er);
    //     }
    // };
    const fetchBooking = async () => {
        try {
            const res = await axios.get("http://localhost:8080/booking/getAll");
            setBooking(res.data);
        } catch (er) {
            console.log(er);
        }
    };

    const handleViewDetail = async (bookingId) => {
        try {
            const res = await axios.get(`http://localhost:8080/bookingDetail/getAll?bookingId=${bookingId}`);
            setSelectedBookingDetail(res.data[0]); // Assuming only one booking detail per booking
            setShowModal(true);
        } catch (er) {
            console.log(er);
        }
    };

    return (
        <>
            <div className='px-3'>
                <Nav Toggle={Toggle} />
                <div className='container-fluid'>
                    <div className='hehe d-flex justify-content-between align-items-center'>
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
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <td>BookingId</td>
                                <td>Date</td>
                                <td>Status</td>
                                <td>TotalPrice</td>
                            </tr>
                        </thead>
                        <tbody>
                            {booking.map((user, index) => (
                                <tr key={index}>
                                    <td>{user.bookingId}</td>
                                    <td>{user.date}</td>
                                    <td>{user.status}</td>
                                    <td>{user.totalPrice}</td>
                                    <td>
                                        <button className="edit-button">Kham</button>
                                    </td>
                                    <td>
                                        <button
                                            className="delete-button"
                                            onClick={() => handleViewDetail(user.bookingId)}
                                        >
                                            View Booking Detail
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
