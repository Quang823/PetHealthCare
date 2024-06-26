import React, { useState, useEffect } from 'react';
import BookingForm from './BookingForm';
import BookingDetail from './BookingDetail';
import { useNavigate } from "react-router-dom";
import './BookingPage.scss';

// const BookingPage = () => {
//     const [bookings, setBookings] = useState([]);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const storedBookings = JSON.parse(localStorage.getItem('bookedInfo')) || [];
//         setBookings(storedBookings);
//     }, []);

//     const Payment = () => {
//         navigate('/payment');
//     };

//     const handleBookingComplete = (newBooking) => {
//         const existingBooking = bookings.find(
//             (booking) =>
//                 booking.petId === newBooking.petId && booking.slotTime === newBooking.slotTime ||
//                 booking.doctorId === newBooking.doctorId && booking.slotTime === newBooking.slotTime
//         );

//         if (existingBooking) {
//             alert('This pet already has a booking for this slot or this slot is already booked by another pet.');
//             return;
//         }

//         const updatedBookings = [...bookings, newBooking];
//         setBookings(updatedBookings);
//         localStorage.setItem('bookedInfo', JSON.stringify(updatedBookings));

//         // Update the booked slots in local storage
//         const bookedSlots = JSON.parse(localStorage.getItem('bookedSlots')) || {};
//         const doctorSlots = bookedSlots[newBooking.doctorId] || [];
//         bookedSlots[newBooking.doctorId] = [...doctorSlots, newBooking.slotTime];
//         localStorage.setItem('bookedSlots', JSON.stringify(bookedSlots));
//     };

//     const handleDelete = (updatedBookings) => {
//         setBookings(updatedBookings);

//         // Update the booked slots in local storage
//         const bookedSlots = JSON.parse(localStorage.getItem('bookedSlots')) || {};
//         bookings.forEach(booking => {
//             const doctorSlots = bookedSlots[booking.doctorId] || [];
//             bookedSlots[booking.doctorId] = doctorSlots.filter(slot => slot !== booking.slotTime);
//         });
//         localStorage.setItem('bookedSlots', JSON.stringify(bookedSlots));
//     };

//     const totalCost = bookings.reduce((acc, booking) => acc + parseFloat(booking.totalCost), 0);

//     // Collect all booked slots, including the doctor ID as key
//     const bookedSlots = {};
//     bookings.forEach(booking => {
//         if (!bookedSlots[booking.doctorId]) {
//             bookedSlots[booking.doctorId] = [];
//         }
//         bookedSlots[booking.doctorId].push(booking.slotTime.toString());
//     });

//     return (
//         <div className="booking-page-container">
//             <div className="booking-page-content">
//                 <div className="booking-form-container">
//                     <BookingForm onBookingComplete={handleBookingComplete} bookedSlots={bookedSlots} />
//                 </div>
//                 {bookings.length > 0 && (
//                     <div className="booking-detail-wrapper">
//                         <h3>Booking Details</h3>
//                         <BookingDetail bookings={bookings} onDelete={handleDelete} showDeleteButton={true} />
//                         <div className="booking-total-cost">Total Cost: ${totalCost.toFixed(2)}</div>
//                         <button id='paymentbutton' onClick={Payment}>Payment</button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };



const BookingPage = () => {
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedBookings = JSON.parse(localStorage.getItem('bookedInfo')) || [];
        setBookings(storedBookings);
    }, []);

    const Payment = () => {
        navigate('/payment');
    };

    // const handleBookingComplete = (newBooking) => {
    //     const existingBooking = bookings.find(
    //         (booking) =>
    //             booking.petId === newBooking.petId && booking.slotTime === newBooking.slotTime ||
    //             booking.doctorId === newBooking.doctorId && booking.slotTime === newBooking.slotTime
    //     );

    //     if (existingBooking) {
    //         alert('This pet already has a booking for this slot or this slot is already booked by another pet.');
    //         return;
    //     }

    //     const updatedBookings = [...bookings, newBooking];
    //     setBookings(updatedBookings);
    //     localStorage.setItem('bookedInfo', JSON.stringify(updatedBookings));

    //     // Update the booked slots in local storage
    //     const bookedSlots = JSON.parse(localStorage.getItem('bookedSlots')) || {};
    //     const doctorSlots = bookedSlots[newBooking.doctorId] || [];
    //     bookedSlots[newBooking.doctorId] = [...doctorSlots, newBooking.slotTime];
    //     localStorage.setItem('bookedSlots', JSON.stringify(bookedSlots));
    // };

    // const handleDelete = (updatedBookings) => {
    //     setBookings(updatedBookings);

    //     // Update the booked slots in local storage
    //     const bookedSlots = {};
    //     updatedBookings.forEach(booking => {
    //         if (!bookedSlots[booking.doctorId]) {
    //             bookedSlots[booking.doctorId] = [];
    //         }
    //         bookedSlots[booking.doctorId].push(booking.slotTime.toString());
    //     });
    //     localStorage.setItem('bookedSlots', JSON.stringify(bookedSlots));
    // };
    const handleBookingComplete = (newBooking) => {
        const existingBooking = bookings.find(
            (booking) =>
                (booking.petId === newBooking.petId && booking.slotTime === newBooking.slotTime && booking.date === newBooking.date) ||
                (booking.doctorId === newBooking.doctorId && booking.slotTime === newBooking.slotTime && booking.date === newBooking.date)
        );
if (existingBooking) {
            alert('This pet already has a booking for this slot on this date or this slot is already booked by another pet on this date.');
            return;
        }

        const updatedBookings = [...bookings, newBooking];
        setBookings(updatedBookings);
        localStorage.setItem('bookedInfo', JSON.stringify(updatedBookings));

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
                        <div className="booking-total-cost">Total Cost: ${totalCost.toFixed(2)}</div>
                        <button id='paymentbutton' onClick={Payment}>Payment</button>
                    </div>
                )}
            </div>
        </div>
    );
};



export default BookingPage;
