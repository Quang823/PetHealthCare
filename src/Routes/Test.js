import React from 'react';
import { Routes, Route, Link } from 'react-router-dom'
import SideBar from '../Components/Test/SideBar/SideBar';
import Body from '../Components/Test/Body/Body';
import TestAdmin from '../Components/Test/TestAdmin';
import UserATest from '../Components/Test/User/UserATest';
const Test = () => {
    return (

        <div className='container-test'>
            <SideBar />
            <Body />
            <Routes>
                <Route path='/testadmin' element={<TestAdmin />} />
                <Route path='/testadminUser' element={<UserATest />} />
            </Routes>
        </div>

    )
}
export default Test