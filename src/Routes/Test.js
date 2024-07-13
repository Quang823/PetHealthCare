import React from 'react';
import { Routes, Route, Link } from 'react-router-dom'
import SideBar from '../Components/Test/SideBar/SideBar';
import Body from '../Components/Test/Body/Body';
import TestAdmin from '../Components/Test/TestAdmin';
import UserATest from '../Components/Test/User/UserATest';
import ServicePet from '../Components/Admin/Service/ServicePet';
import TestAdminLayout from '../Components/Test/TestAdminLayout';
const Test = () => {
    return (

       
           
            <Routes>
                <Route path='/testadmin' element={<TestAdminLayout />} />
                <Route path='/testadminUser' element={<UserATest />} />
               
                <Route path='/servicePet' element={<ServicePet />} />
            </Routes>
        
    )
}
export default Test