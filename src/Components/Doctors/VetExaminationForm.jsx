import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function VetExaminationForm() {
    const location = useLocation();
    const navigate = useNavigate();
    const booking = location.state.booking;

    const [bookingDetail, setBookingDetail] = useState(null);
    const [veterinaryName, setVeterinaryName] = useState('');
    const [treatmentResult, setTreatmentResult] = useState('');
    const [dateMedical, setDateMedical] = useState(new Date());

    useEffect(() => {
        const fetchBookingDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/bookingDetail/getAllByBookingId/${bookingId}`);
                setBookingDetail(response.data);
                console.log('Booking detail:', response.data);
            } catch (error) {
                console.error('Error fetching booking detail:', error);
            }
        };

        fetchBookingDetail();
    }, [booking.id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            veterinaryName,
            treatmentResult,
            dateMedical
        };

        console.log('Form data to be submitted:', data);

        try {
            const response = await axios.post(`http://localhost:8080/medical-history/create/${bookingDetail.petId}`, data);
            console.log('API response:', response);
            navigate('/doctor'); // Redirect back to the doctor's home page
        } catch (error) {
            console.error('Error updating medical history:', error);
        }
    };

    return (
        <div className='container'>
            <h1>Examine Pet</h1>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='veterinaryName'>Veterinary Name</label>
                    <input
                        type='text'
                        id='veterinaryName'
                        value={veterinaryName}
                        onChange={(e) => setVeterinaryName(e.target.value)}
                        className='form-control'
                        required
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='treatmentResult'>Treatment Result</label>
                    <textarea
                        id='treatmentResult'
                        value={treatmentResult}
                        onChange={(e) => setTreatmentResult(e.target.value)}
                        className='form-control'
                        required
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='dateMedical'>Date of Examination</label>
                    <input
                        type='date'
                        id='dateMedical'
                        value={dateMedical.toISOString().split('T')[0]}
                        onChange={(e) => setDateMedical(new Date(e.target.value))}
                        className='form-control'
                        required
                    />
                </div>
                <button type='submit' className='btn btn-primary'>
                    Submit
                </button>
            </form>
        </div>
    );
}

export default VetExaminationForm;
