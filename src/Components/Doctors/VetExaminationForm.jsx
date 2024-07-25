import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, useLocation } from 'react-router-dom';
import './VetExaminationForm.scss'; // Import the new CSS file

function VetExaminationForm() {
    const [treatmentResult, setTreatmentResult] = useState('');
    const [dateMedical, setDateMedical] = useState(new Date()); // Initialize with today's date
    const [veterinaryName, setVeterinaryName] = useState('');
    const [needCage, setNeedCage] = useState(false);
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
        const petId = bookingDetail?.pet?.petId;
        const bookingDetailId = bookingDetail?.bookingDetailId;
        if (!petId) {
            console.error('No pet ID found in booking detail');
            return;
        }

        if (bookingDetail?.booking?.status === 'Completed') {
            console.error('This booking has already been completed.');
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
            // First, create the medical history
            const response = await axios.post(`http://localhost:8080/medical-history/create/${petId}`, formData);
            console.log("Medical history created successfully:", response.data);

            // Update the needCage status if applicable
            if (needCage && bookingDetailId) {
                console.log("Updating Need Cage status to true for bookingDetailId:", bookingDetailId);
                try {
                    await axios.put(`http://localhost:8080/bookingDetail/needCage/${bookingDetailId}`);
                } catch (error) {
                    console.error('Error updating Need Cage status:', error);
                }
            }

            // Update the booking detail status to "Examination has been completed"
            try {
                await axios.put(`http://localhost:8080/bookingDetail/update/status/${bookingDetailId}`, { status: 'Completed' });
                console.log('Booking detail status updated to "Completed"');
            } catch (error) {
                console.error('Error updating booking detail status:', error);
            }

            navigate('/doctor');
        } catch (error) {
            console.error('Error creating medical history:', error);
        }
    };

    return (
        <div className="vet-exam-container">
            <h1 className="vet-exam-header">Doctor Examination</h1>
            <form onSubmit={handleSubmit} className="vet-exam-form">
                <div className="vet-exam-form-group">
                    <label className="vet-exam-label">Veterinary Name</label>
                    <input
                        type="text"
                        className="vet-exam-input"
                        value={veterinaryName}
                        readOnly
                    />
                </div>
                <div className="vet-exam-form-group">
                    <label className="vet-exam-label">Treatment Result</label>
                    <input
                        type="text"
                        className="vet-exam-input"
                        value={treatmentResult}
                        onChange={(e) => setTreatmentResult(e.target.value)}
                        required
                        placeholder="Enter the treatment result"
                    />
                </div>
                <div className="vet-exam-form-group">
                    <label className="vet-exam-label">Date Medical</label>
                    <DatePicker
                        selected={dateMedical}
                        onChange={(date) => setDateMedical(date)}
                        dateFormat="dd MMMM yyyy"
                        className="vet-exam-datepicker"
                        disabled // Disable the date picker
                    />
                </div>
                <div className="vet-exam-form-group vet-exam-form-check">
                    <input
                        type="checkbox"
                        className="vet-exam-checkbox"
                        id="needCage"
                        checked={needCage}
                        onChange={(e) => setNeedCage(e.target.checked)}
                    />
                    <label className="vet-exam-checkbox-label" htmlFor="needCage">Need Cage</label>
                </div>
                <button type="submit" className="vet-exam-button">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default VetExaminationForm;
