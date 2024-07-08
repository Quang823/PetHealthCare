import React from 'react';
import { Routes, Route, Link } from 'react-router-dom'
import Doctor from '../Components/Doctors/Doctor';
import Schedule from '../Components/Doctors/Schedule/Schedule';
import VetExaminationForm from '../Components/Doctors/VetExaminationForm';
const DoctorLayout = () => {
    return (
        <>
            <Routes>
                <Route path='/doctor' element={<Doctor />} />
                <Route path='/scheduleDoctor' element={<Schedule />} />
                <Route path='/examineDoctor' element={<VetExaminationForm />} />
            </Routes>
        </>
    )
}
export default DoctorLayout;