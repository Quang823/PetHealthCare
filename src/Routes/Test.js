import React from 'react';
import { Routes, Route, Link } from 'react-router-dom'
import SideBar from '../Components/Test/SideBar/SideBar';
import Body from '../Components/Test/Body/Body';
import TestAdmin from '../Components/Test/TestAdmin';
import UserATest from '../Components/Test/User/UserATest';
import ServicePet from '../Components/Admin/Service/ServicePet';
const Test = () => {
    return (

        <div className='container-test'>
            <SideBar />
            <Body />
            <Routes>
                <Route path='/testadmin' element={<TestAdmin />} />
                <Route path='/testadminUser' element={<UserATest />} />
               
                <Route path='/servicePet' element={<ServicePet />} />
            </Routes>
        </div>

    )
}
export default Test