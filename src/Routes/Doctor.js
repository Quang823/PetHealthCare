import React from 'react';
import { Routes, Route, Link } from 'react-router-dom'
import Doctor  from '../Components/Doctors/Doctor';
import Schedule from '../Components/Doctors/Schedule/Schedule';
const DoctorLayout = () => {
return(
    <>
    <Routes>
        <Route path='/doctor' element={<Doctor />} />
        <Route path='/scheduleDoctor' element={<Schedule />} />
    </Routes>
</>
)
}
export default DoctorLayout;