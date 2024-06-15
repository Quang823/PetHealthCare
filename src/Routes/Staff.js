import React from 'react';
import { Routes, Route, Link } from 'react-router-dom'
import StaffLayout from '../Components/Staff/StaffLayout';
const Staff = () =>{
return(
    <>
    <Routes>
        <Route path='/staff' element={<StaffLayout/>} />
    </Routes>
</>
)
}
export default Staff