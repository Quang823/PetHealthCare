import React, { useState } from 'react';
import logo from '../../Assets/v186_574.png';
import './VetExaminationForm.scss';

const VetExaminationForm = () => {
    const [rows, setRows] = useState([{
        id: 1, petName: '', petType: '', symptoms: '', diagnosis: '', treatment: '', doctor: '', price: '', discount: '', total: ''
    }]);
    const [booking, setBooking] = useState({ slot: '', date: '', content: '' });
    const [ownerInfo, setOwnerInfo] = useState({ name: '', phone: '', address: '' });

    const addRow = () => {
        setRows([...rows, { id: rows.length + 1, petName: '', petType: '', symptoms: '', diagnosis: '', treatment: '', doctor: '', price: '', discount: '', total: '' }]);
    };

    const handleChange = (index, e) => {
        const { name, value } = e.target;
        const updatedRows = [...rows];
        updatedRows[index][name] = value;
        setRows(updatedRows);
    };

    const handleBookingChange = (e) => {
        const { name, value } = e.target;
        setBooking({ ...booking, [name]: value });
    };

    const handleOwnerInfoChange = (e) => {
        const { name, value } = e.target;
        setOwnerInfo({ ...ownerInfo, [name]: value });
    };

    const calculateTotal = () => {
        return rows.reduce((acc, row) => {
            const price = parseFloat(row.price) || 0;
            const discount = parseFloat(row.discount) || 0;
            return acc + (price - discount);
        }, 0);
    };

    return (
        <div className="vetexaminate-form">
            <header className="Headers">
                <div className="logo-contain">
                    <img src={logo} alt="Logo image" className="logovet" />
                </div>
                <div className="clinic-info">
                    <h1>ABC Pet Clinic</h1>
                    <p>Address: 123 XYZ Street, District 1, Ho Chi Minh City</p>
                    <p>Phone: 0909 123 456</p>
                </div>
            </header>
            <main>
                <h2>Medical Examination Form</h2>
                <section className="owner-info">
                    <h3>Owner Information</h3>
                    <div className="forms-group">
                        <label>Name:</label>
                        <input type="text" name="name" value={ownerInfo.name} onChange={handleOwnerInfoChange} />
                    </div>
                    <div className="forms-group">
                        <label>Phone:</label>
                        <input type="tel" name="phone" value={ownerInfo.phone} onChange={handleOwnerInfoChange} />
                    </div>
                    <div className="forms-group">
                        <label>Address:</label>
                        <input type="text" name="address" value={ownerInfo.address} onChange={handleOwnerInfoChange} />
                    </div>
                </section>
                <section className="medical-table">
                    <h3>Medical Information</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Visit</th>
                                <th>Pet Name</th>
                                <th>Pet Type</th>
                                <th>Symptoms/Diagnosis</th>
                                <th>Treatment</th>
                                <th>Doctor</th>
                                <th>Price</th>
                                <th>Discount</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, index) => (
                                <tr key={row.id}>
                                    <td>{row.id}</td>
                                    <td><input type="text" name="petName" value={row.petName} onChange={(e) => handleChange(index, e)} /></td>
                                    <td><input type="text" name="petType" value={row.petType} onChange={(e) => handleChange(index, e)} /></td>
                                    <td><input type="text" name="symptoms" value={row.symptoms} onChange={(e) => handleChange(index, e)} /></td>
                                    <td><input type="text" name="diagnosis" value={row.diagnosis} onChange={(e) => handleChange(index, e)} /></td>
                                    <td><input type="text" name="treatment" value={row.treatment} onChange={(e) => handleChange(index, e)} /></td>
                                    <td><input type="number" name="price" value={row.price} onChange={(e) => handleChange(index, e)} /></td>
                                    <td><input type="number" name="discount" value={row.discount} onChange={(e) => handleChange(index, e)} /></td>
                                    <td>{(parseFloat(row.price) || 0) - (parseFloat(row.discount) || 0)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button type="button" onClick={addRow}>Add Row</button>
                </section>
                <section className="booking-info">
                    <div className="booking-details">
                        <h4>Booking Details</h4>
                        <div className="form-group">
                            <label>Slot:</label>
                            <input type="text" name="slot" value={booking.slot} onChange={handleBookingChange} />
                        </div>
                        <div className="form-group">
                            <label>Date:</label>
                            <input type="date" name="date" value={booking.date} onChange={handleBookingChange} />
                        </div>
                        <div className="form-group">
                            <label>Content:</label>
                            <textarea name="content" value={booking.content} onChange={handleBookingChange}></textarea>
                        </div>
                    </div>
                    <div className="total-amount">
                        <h4>Total Amount</h4>
                        <p>{calculateTotal()}</p>
                    </div>
                </section>
            </main>
            <footer>
                <section className="doctor-notes">
                    <h4>Doctor's Advice</h4>
                    <textarea></textarea>
                </section>
                <div className="signatures">
                    <div className="owner-signature">
                        <p>Owner's Name</p>
                        <div className="signature-box"></div>
                    </div>
                    <div className="doctor-signature">
                        <p>Doctor's Name</p>
                        <div className="signature-box"></div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default VetExaminationForm;

