import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from 'sweetalert2';  // Import SweetAlert2
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';  // Ensure correct import
import { useNavigate, useLocation } from 'react-router-dom';
import './VetExaminationForm.scss';

function VetExaminationForm() {
    const [dateMedical, setDateMedical] = useState(new Date());
    const [veterinaryName, setVeterinaryName] = useState('');
    const [diseaseName, setDiseaseName] = useState('');
    const [treatmentMethod, setTreatmentMethod] = useState('');
    const [note, setNote] = useState('');
    const [reminders, setReminders] = useState('');
    const [vaccine, setVaccine] = useState('');
    const [needCage, setNeedCage] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { bookingDetail } = location.state || {};
    const [errors, setErrors] = useState({
        diseaseName: false,
        treatmentMethod: false,
        reminders: false,
    });

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

    const handleSubmit = (event) => {
        event.preventDefault();

        // Initialize error state
        const newErrors = {
            diseaseName: !diseaseName,
            treatmentMethod: !treatmentMethod,
            reminders: !reminders,
        };

        // Update the errors state
        setErrors(newErrors);

        // Check for empty fields and show SweetAlert2 alerts
        let errorMessages = [];

        if (!diseaseName) {
            errorMessages.push("Disease Name is required.");
        }
        if (!treatmentMethod) {
            errorMessages.push("Treatment Method is required.");
        }
        if (!reminders) {
            errorMessages.push("Reminders are required.");
        }

        if (errorMessages.length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: errorMessages.join('\n'),
            });

            // Focus on the first empty field
            if (newErrors.diseaseName) {
                document.querySelector('textarea[name="diseaseName"]').focus();
            } else if (newErrors.treatmentMethod) {
                document.querySelector('textarea[name="treatmentMethod"]').focus();
            } else if (newErrors.reminders) {
                document.querySelector('textarea[name="reminders"]').focus();
            }

            return; // Prevent form submission
        }

        const data = {
            veterinaryName,
            dateMedicalHistory: dateMedical, // Format date to MM/DD/YYYY
            diseaseName,
            treatmentMethod,
            note,
            reminders,
            vaccine
        };

        axios.post(`http://localhost:8080/medical-history/create/${bookingDetail.pet.petId}`, data)
            .then(response => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Medical history created successfully.',
                }).then(() => {
                    navigate('/doctor'); // Redirect to another page after success
                });
            })
            .catch(error => {
                console.error('There was an error creating the medical history!', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'There was an error creating the medical history.',
                });
            });

        // Reset errors if needed
        setErrors({
            diseaseName: false,
            treatmentMethod: false,
            reminders: false,
        });
    };

    const handleInputChange = (setter) => (e) => {
        const value = e.target.value || '';
    
        // Split value into words
        const words = value.split(' ');
    
        // Create formatted lines
        const formattedLines = [];
        let currentLine = [];
    
        for (let i = 0; i < words.length; i++) {
            // Add word to current line
            currentLine.push(words[i]);
    
            // If line length reaches 200 words, end current line and start a new one
            if (currentLine.length === 200) {
                formattedLines.push(currentLine.join(' '));
                currentLine = [];
            }
        }
    
        // Add remaining words to final line
        if (currentLine.length > 0) {
            formattedLines.push(currentLine.join(' '));
        }
    
        // Join lines into a single string
        const formattedValue = formattedLines.join('\n');
        setter(formattedValue);
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
                    <label className="vet-exam-label">Disease Name</label>
                    <textarea
                        name="diseaseName"
                        className={`vet-exam-input ${errors.diseaseName ? 'error' : ''}`}
                        value={diseaseName}
                        onChange={handleInputChange(setDiseaseName)}
                        required
                        placeholder="Enter the disease name"
                        rows={2}
                    />
                </div>

                <div className="vet-exam-form-group">
                    <label className="vet-exam-label">Treatment Method</label>
                    <textarea
                        name="treatmentMethod"
                        className={`vet-exam-input ${errors.treatmentMethod ? 'error' : ''}`}
                        value={treatmentMethod}
                        onChange={handleInputChange(setTreatmentMethod)}
                        required
                        placeholder="Enter the treatment method"
                        rows={2}
                    />
                </div>

                <div className="vet-exam-form-group"><label className="vet-exam-label">Note</label>
                    <textarea
                        name="note"
                        className="vet-exam-input"
                        value={note}
                        onChange={handleInputChange(setNote)}
                        placeholder="Enter any notes"
                        rows={2}
                    />
                </div>

                <div className="vet-exam-form-group">
                    <label className="vet-exam-label">Reminders</label>
                    <textarea
                        name="reminders"
                        className={`vet-exam-input ${errors.reminders ? 'error' : ''}`}
                        value={reminders}
                        onChange={handleInputChange(setReminders)}
                        required
                        placeholder="Enter any reminders"
                        rows={2}
                    />
                </div>

                <div className="vet-exam-form-group">
                    <label className="vet-exam-label">Vaccine</label>
                    <textarea
                        name="vaccine"
                        className="vet-exam-input"
                        value={vaccine}
                        onChange={handleInputChange(setVaccine)}
                        placeholder="Enter the vaccine information"
                        rows={2}
                    />
                </div>

                <div className="vet-exam-form-group">
                    <label className="vet-exam-label">Date Medical</label>
                    <DatePicker
                        selected={dateMedical}
                        onChange={(date) => setDateMedical(date)}
                        dateFormat="yyyy-MM-dd"
                        className="vet-exam-datepicker"
                        disabled
                    />
                </div>
                
                <button type="submit" className="vet-exam-button">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default VetExaminationForm;
