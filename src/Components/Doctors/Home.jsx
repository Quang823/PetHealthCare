import React, { useState } from 'react';
import Nav from './Nav';
import { Link, useNavigate } from "react-router-dom";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Homee.scss';

function Home({ Toggle }) {
    const [users, setUsers] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/doctor');
    };

    return (
        <>
            <div className='px-3'>
                <Nav Toggle={Toggle} />
                <div className='container-fluid'>
                    <div className='hehe d-flex justify-content-between align-items-center'>
                        <h2 className="my-4">Schedule</h2>
                        <div className="date-picker">
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                                minDate={new Date()}
                                dateFormat="dd MMMM yyyy"
                                className="form-control"
                            />
                        </div>
                    </div>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Slot</th>
                                <th>Pet nam</th>
                                <th>Gender</th>
                                <th>Note</th>
                                <th>HEHE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={index}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.address}</td>
                                    <td>{user.role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default Home;
