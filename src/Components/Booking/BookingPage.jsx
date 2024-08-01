import React, { useState, useEffect } from 'react';
import BookingForm from './BookingForm';
import BookingDetail from './BookingDetail';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from 'axios';
import './BookingPage.scss';
import { jwtDecode } from 'jwt-decode';

const BookingPage = () => {
    const [bookings, setBookings] = useState([]);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedBookings = JSON.parse(localStorage.getItem('bookings')) || [];
        setBookings(storedBookings);
    }, []);

    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found in localStorage.');
                return;
            }

            try {
                const decodedToken = jwtDecode(token);
                const userID = decodedToken.User.map.userID;

                // Fetch user information
                const userResponse = await axios.get(`http://localhost:8080/account/getaccount/${userID}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setUser(userResponse.data);
            } catch (error) {
                console.error('Error fetching user info:', error);
                toast.error("Failed to fetch user information. Please try logging in again.");
            }
        };
        fetchUserInfo();
    }, []);

    const Payment = async () => {
        try {
            await handleBooking(); // Lưu thông tin booking trước khi chuyển sang trang payment
            navigate('/payment');
        } catch (error) {
            console.error('Booking failed:', error);
            toast.error("Booking failed. Please try again.");
        }
    };

    const handleBookingComplete = (newBooking) => {
        const existingBooking = bookings.find(
            (booking) =>
                (booking.petId === newBooking.petId && booking.slotTime === newBooking.slotTime && booking.date === newBooking.date) ||
                (booking.doctorId === newBooking.doctorId && booking.slotTime === newBooking.slotTime && booking.date === newBooking.date)
        );

        if (existingBooking) {
            toast.error('This pet already has a booking for this slot on this date or this slot is already booked by another pet on this date.');
            return;
        }

        const updatedBookings = [...bookings, newBooking];
        setBookings(updatedBookings);
        //localStorage.setItem('updatedBookings', JSON.stringify(updatedBookings));

        // Update the booked slots in local storage
        const bookedSlots = JSON.parse(localStorage.getItem('bookedSlots')) || {};
        const doctorSlots = bookedSlots[newBooking.doctorId] || [];
        bookedSlots[newBooking.doctorId] = [...doctorSlots, `${newBooking.slotTime}-${newBooking.date}`];
        localStorage.setItem('bookedSlots', JSON.stringify(bookedSlots));
    };

    const handleDelete = (updatedBookings) => {
        setBookings(updatedBookings);

        // Update the booked slots in local storage
        const bookedSlots = {};
        updatedBookings.forEach(booking => {
            if (!bookedSlots[booking.doctorId]) {
                bookedSlots[booking.doctorId] = [];
            }
            bookedSlots[booking.doctorId].push(`${booking.slotTime}-${booking.date}`);
        });
        localStorage.setItem('bookedSlots', JSON.stringify(bookedSlots));
    };

    const handleBooking = async () => {
        if (!user) {
            console.error('User information is missing.');
            toast.error("User information not found. Please log in again.");
            return;
        }

        const bookingData = {
            customerId: user.userId,
            date: new Date(),
            status: "Unpaid",
            totalPrice: bookings.reduce((acc, booking) => acc + parseFloat(booking.totalCost || 0), 0),
            bookingDetails: bookings.map(booking => ({
                petId: booking.petId,
                veterinarianId: booking.doctorId,
                serviceId: booking.serviceId,
                needCage: false,
                date: booking.date,
                slotId: parseInt(booking.slotTime, 10)
            }))
        };

        try {
            const token = localStorage.getItem('token');
            const bookingResponse = await axios.post('http://localhost:8080/booking/add', bookingData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log("Booking Response:", bookingResponse.data);
            localStorage.setItem('currentBookingId', bookingResponse.data.data.bookingId);
        } catch (error) {
            console.error('Booking failed:', error.response?.data || error);
            toast.error("Booking failed. Please try again.");
        }
    };

    const totalCost = bookings.reduce((acc, booking) => acc + parseFloat(booking.totalCost), 0);

    // Collect all booked slots, including the doctor ID as key
    const bookedSlots = {};
    bookings.forEach(booking => {
        if (!bookedSlots[booking.doctorId]) {
            bookedSlots[booking.doctorId] = [];
        }
        bookedSlots[booking.doctorId].push(booking.slotTime.toString());
    });

    return (
        <div className="booking-page-container">
            <div className="booking-page-content">
                <div className="booking-form-container">
                    <BookingForm onBookingComplete={handleBookingComplete} bookedSlots={bookedSlots} />
                </div>
                {bookings.length > 0 && (
                    <div className="booking-detail-wrapper">
                        <h3>Booking Details</h3>
                        <BookingDetail bookings={bookings} onDelete={handleDelete} showDeleteButton={true} />
                        <div className="booking-total-cost">Total Cost: {totalCost} VND</div>
                        <button id='paymentbutton' onClick={Payment}>Payment</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingPage;
