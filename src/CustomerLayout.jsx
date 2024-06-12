// CustomerLayout.js
import React from 'react';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';

const CustomerLayout = ({ children }) => {
    return (
        <div className='app-container'>
            <Header></Header>
            <div className='main-content'>
                {children}
            </div>
            <Footer></Footer>
        </div>
    );
};

export default CustomerLayout;
