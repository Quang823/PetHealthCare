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
                return new Date(a.dateMedical) - new Date(b.dateMedical);
            } else {
                return new Date(b.dateMedical) - new Date(a.dateMedical);
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
            const medicalDate = new Date(medical.dateMedical);
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
        (searchDate === '' || new Date(medical.dateMedical).toISOString().slice(0, 10) === searchDate) &&
        (searchDoctor === '' || medical.veterinaryName.toLowerCase().includes(searchDoctor.toLowerCase())) &&
        (searchDiagnosis === '' || medical.treatmentResult.toLowerCase().includes(searchDiagnosis.toLowerCase())) &&
        (selectedDoctor === '' || medical.veterinaryName === selectedDoctor) &&
        (selectedDiagnosis === '' || medical.treatmentResult === selectedDiagnosis)
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
                    {Array.from(new Set(medicalHistoryData.map(medical => medical.treatmentResult))).map(diagnosis => (
                        <option key={diagnosis} value={diagnosis}>{diagnosis}</option>
                    ))}
                </select>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <button onClick={handleDateFilter}>Filter by Date</button>
                <CSVLink data={medicalHistoryData} filename={"medical-history.csv"}>
                    <button>Export to CSV</button>
                </CSVLink>
            </div>
            <div className="timetable">
                <div className="timetable-header">
                    <div className="timetable-header-item">HistoryID</div>
                    <div className="timetable-header-item">Date</div>
                    <div className="timetable-header-item">Doctor</div>
                    <div className="timetable-header-item">Diagnosis</div>
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
                        title={`Medical on ${medical.dateMedical} with ${medical.veterinaryName} for ${medical.treatmentResult}`}
                        onClick={() => handleMedicalClick(medical)}
                    >
                        <div className="timetable-item">{medical.medicalHistoryId}</div>
                        <div className="timetable-item">{formatDate(medical.dateMedical)}</div>
                        <div className="timetable-item">{medical.veterinaryName}</div>
                        <div className="timetable-item">{medical.treatmentResult}</div>
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
                        <p><strong>Date:</strong> {formatDate(selectedMedical.dateMedical)}</p>
                        <p><strong>Medical History ID:</strong> {selectedMedical.medicalHistoryId}</p>
                        <p><strong>Doctor:</strong> {selectedMedical.veterinaryName}</p>
                        <p><strong>Diagnosis:</strong> {selectedMedical.treatmentResult}</p>
                        <p><strong>Notes:</strong> {selectedMedical.notes}</p>
                        <p><strong>Important:</strong> {selectedMedical.important ? 'Yes' : 'No'}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MedicalHistory;
