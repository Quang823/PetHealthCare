import React, { useState, useEffect } from 'react';
import './MedicalHistory.scss';
import { CSVLink } from 'react-csv';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const MedicalHistory = () => {
    const { petID } = useParams(); // Get petID from the URL parameters
    const [medicalHistoryData, setMedicalHistoryData] = useState([]);
    const [searchDate, setSearchDate] = useState('');
    const [searchDoctor, setSearchDoctor] = useState('');
    const [searchDiagnosis, setSearchDiagnosis] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedDiagnosis, setSelectedDiagnosis] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedMedical, setSelectedMedical] = useState(null);

    useEffect(() => {
        // Fetch data from the API
        console.log(`Fetching medical history for petID: ${petID}`);
        axios.get(`http://localhost:8080/medical-history/getAll/${petID}`)
            .then(response => {
                console.log('API Response:', response.data);
                setMedicalHistoryData(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the medical history data!', error);
                console.error('Error details:', error.response);
            });
    }, [petID]); // Fetch data when petID changes

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    const handleSearchDate = (event) => {
        setSearchDate(event.target.value);
    };

    const handleSearchDoctor = (event) => {
        setSearchDoctor(event.target.value);
    };

    const handleSearchDiagnosis = (event) => {
        setSearchDiagnosis(event.target.value);
    };

    const handleSort = () => {
        const sortedData = [...medicalHistoryData].sort((a, b) => {
            if (sortOrder === 'asc') {
                return new Date(a.dateMedicalHistory) - new Date(b.dateMedicalHistory);
            } else {
                return new Date(b.dateMedicalHistory) - new Date(a.dateMedicalHistory);
            }
        });
        setMedicalHistoryData(sortedData);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const handleDoctorFilter = (event) => {
        setSelectedDoctor(event.target.value);
    };

    const handleDiagnosisFilter = (event) => {
        setSelectedDiagnosis(event.target.value);
    };

    const handleDateFilter = () => {
        const filteredData = medicalHistoryData.filter((medical) => {
            const medicalDate = new Date(medical.dateMedicalHistory);
            const start = startDate ? new Date(startDate) : new Date('1900-01-01');
            const end = endDate ? new Date(endDate) : new Date();
            return medicalDate >= start && medicalDate <= end;
        });
        setMedicalHistoryData(filteredData);
    };

    const handleImportantToggle = (index) => {
        const updatedData = [...medicalHistoryData];
        updatedData[index].important = !updatedData[index].important;
        setMedicalHistoryData(updatedData);
    };

    const handleMedicalClick = (medical) => {
        setSelectedMedical(medical);
    };

    const handleCloseModal = () => {
        setSelectedMedical(null);
    };

    const filteredData = medicalHistoryData.filter((medical) =>
        (searchDate === '' || new Date(medical.dateMedicalHistory).toISOString().slice(0, 10) === searchDate) &&
        (searchDoctor === '' || medical.veterinaryName.toLowerCase().includes(searchDoctor.toLowerCase())) &&
        (searchDiagnosis === '' || medical.diseaseName.toLowerCase().includes(searchDiagnosis.toLowerCase())) &&
        (selectedDoctor === '' || medical.veterinaryName === selectedDoctor) &&
        (selectedDiagnosis === '' || medical.diseaseName === selectedDiagnosis)
    );

    const colors = ['#ffcccc', '#ccffcc', '#ccccff', '#ffcc99', '#99ccff', '#ff99cc'];

    return (
        <div className="medical-history">
            <div className='header-text'>
                <h2>Medical History</h2>
            </div>
            <div className="search-bar">
                <input
                    type="date"
                    value={searchDate}
                    onChange={handleSearchDate}
                />
                <input
                    type="text"
                    placeholder="Search by doctor..."
                    value={searchDoctor}
                    onChange={handleSearchDoctor}
                />
                <input
                    type="text"
                    placeholder="Search by diagnosis..."
                    value={searchDiagnosis}
                    onChange={handleSearchDiagnosis}
                />
                <button onClick={handleSort}>
                    Sort by Date ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
                </button>
            </div>
            <div className="filters">
                <select value={selectedDoctor} onChange={handleDoctorFilter}>
                    <option value="">All Doctors</option>
                    {Array.from(new Set(medicalHistoryData.map(medical => medical.veterinaryName))).map(doctor => (
                        <option key={doctor} value={doctor}>{doctor}</option>
                    ))}
                </select>
                <select value={selectedDiagnosis} onChange={handleDiagnosisFilter}>
                    <option value="">All Diagnoses</option>
                    {Array.from(new Set(medicalHistoryData.map(medical => medical.diseaseName))).map(diagnosis => (
                        <option key={diagnosis} value={diagnosis}>{diagnosis}</option>
                    ))}
                </select>
                <CSVLink data={medicalHistoryData} filename={"medical-history.csv"}>
                    <button>Export to CSV</button>
                </CSVLink>
            </div>
            <div className="timetable">
                <div className="timetable-header">
                    <div className="timetable-header-item">Date Medical</div>
                    <div className="timetable-header-item">Veterinary Name</div>
                    <div className="timetable-header-item">Disease Name</div>
                    <div className="timetable-header-item">Treatment Method</div>
                    <div className="timetable-header-item">Note</div>
                    <div className="timetable-header-item">Reminders</div>
                    <div className="timetable-header-item">Important</div>
                </div>
                {filteredData.map((medical, index) => (
                    <div
                        key={index}
                        className="timetable-row"
                        style={{
                            backgroundColor: medical.important ? '#ffcc00' : colors[index % colors.length],
                            fontWeight: medical.important ? 'bold' : 'normal'
                        }}
                        title={`Medical on ${medical.dateMedicalHistory} with ${medical.veterinaryName} for ${medical.diseaseName}`}
                        onClick={() => handleMedicalClick(medical)}
                    >
                        <div className="timetable-item">{formatDate(medical.dateMedicalHistory)}</div>
                        <div className="timetable-item">{medical.veterinaryName}</div>
                        <div className="timetable-item">{medical.diseaseName}</div>
                        <div className="timetable-item">{medical.treatmentMethod}</div>
                        <div className="timetable-item">{medical.note}</div>
                        <div className="timetable-item">{medical.reminders}</div>
                        <div className="timetable-item">
                            <input
                                type="checkbox"
                                checked={medical.important}
                                onChange={() => handleImportantToggle(index)}
                            />
                        </div>
                    </div>
                ))}
            </div>
            {selectedMedical && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-button" onClick={handleCloseModal}>&times;</span>
                        <h2>Medical History Details</h2>
                        <p><strong>Veterinary Name:</strong> {selectedMedical.veterinaryName}</p>
                        <p><strong>Disease Name:</strong> {selectedMedical.diseaseName}</p>
                        <p><strong>Treatment Method:</strong> {selectedMedical.treatmentMethod}</p>
                        <p><strong>Note:</strong> {selectedMedical.note}</p>
                        <p><strong>Reminders:</strong> {selectedMedical.reminders}</p>
                        <p><strong>Date Medical:</strong> {formatDate(selectedMedical.dateMedicalHistory)}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MedicalHistory;
