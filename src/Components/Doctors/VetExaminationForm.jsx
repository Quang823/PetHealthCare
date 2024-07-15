import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, useLocation } from 'react-router-dom';

function VetExaminationForm() {
    const [treatmentResult, setTreatmentResult] = useState('');
    const [dateMedical, setDateMedical] = useState(new Date());
    const [veterinaryName, setVeterinaryName] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { bookingDetail } = location.state || {};

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setVeterinaryName(decodedToken.User.map.name); // Adjust based on token structure
        }
    }, []);

    useEffect(() => {
        console.log("Received bookingDetail:", bookingDetail);
    }, [bookingDetail]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const petId = bookingDetail.pet.petId;
        if (!petId) {
            console.error('No pet ID found in booking detail');
            return;
        }

        // Format date to yyyy-MM-dd
        const formattedDateMedical = dateMedical.toISOString().split('T')[0];

        const formData = {
            veterinaryName,
            treatmentResult,
            dateMedical: formattedDateMedical
        };

        console.log("Form data being submitted:", formData);

        try {
            const response = await axios.post(`http://localhost:8080/medical-history/create/${petId}`, formData);
            console.log("Medical history created successfully:", response.data);
            navigate('/doctor');
        } catch (error) {
            console.error('Error creating medical history:', error);
        }
    };

    return (
        <div className="container">
            <h1>Doctor Examination</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Veterinary Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={veterinaryName}
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label>Treatment Result</label>
                    <input
                        type="text"
                        className="form-control"
                        value={treatmentResult}
                        onChange={(e) => setTreatmentResult(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Date Medical</label>
                    <DatePicker
                        selected={dateMedical}
                        onChange={(date) => setDateMedical(date)}
                        minDate={new Date()}
                        dateFormat="dd MMMM yyyy"
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default VetExaminationForm;
