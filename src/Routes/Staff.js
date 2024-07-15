import React from 'react';
import { Routes, Route, Link } from 'react-router-dom'
import StaffLayout from '../Components/Staff/StaffLayout';
import BookingStaff from '../Components/Staff/Booking/BookingStaff';
import Cage from '../Components/Staff/Cage/Cage';
import EditSlot from '../Components/Staff/Slot/EditSlot';
import AddSlot from '../Components/Staff/Slot/AddSlot';
const Staff = () => {
    return (
        <>
            <Routes>
                <Route path='/staff' element={<StaffLayout />} />
                {/* <Route path='/homeStaff' element={<HomeStaff />} /> */}
                <Route path='/bookingstaff' element={<BookingStaff />} />
                <Route path='/cagestaff' element={<Cage />} />
                <Route path='/addslotStaff' element={<AddSlot />} />
                <Route path='/editslotStaff' element={<EditSlot />} />


            </Routes>
        </>
    )
}
export default Staff