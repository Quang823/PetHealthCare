import React from 'react';
import { Routes, Route, Link } from 'react-router-dom'
import StaffLayout from '../Components/Staff/StaffLayout';
import BookingStaff from '../Components/Staff/Booking/BookingStaff';
import Cage from '../Components/Staff/Cage/Cage';
const Staff = () => {
    return (
        <>
            <Routes>
                <Route path='/staff' element={<StaffLayout />} />
                <Route path='/homeStaff' element={<HomeStaff />} />
                <Route path='/bookingstaff' element={<BookingStaff />} />
                <Route path='/cagestaff' element={<Cage />} />

            </Routes>
        </>
    )
}
export default Staff