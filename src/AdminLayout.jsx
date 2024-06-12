// AdminLayout.js
import React from 'react';

const AdminLayout = ({ children }) => {
    return (
        <div className='admin-container'>
            <div className='main-content'>
                {children}
            </div>
        </div>
    );
};

export default AdminLayout;
