import React, { useState } from 'react';
import './MedicalHistory.scss';
import { CSVLink } from 'react-csv';

const MedicalHistory = () => {
    const initialData = [
        { date: '2023-01-15', doctor: 'Dr. Quang', diagnosis: 'Flu', important: false, notes: 'Prescribed medication A' },
        { date: '2023-02-10', doctor: 'Dr. Thinh', diagnosis: 'Cold', important: false, notes: 'Advised rest and hydration' },
        { date: '2023-03-20', doctor: 'Dr. Hao', diagnosis: 'Allergy', important: false, notes: 'Prescribed antihistamines' },
        { date: '2023-04-25', doctor: 'Dr. An', diagnosis: 'Fever', important: true, notes: 'Prescribed fever reducers' },
        { date: '2023-05-30', doctor: 'Dr. Dat', diagnosis: 'Migraine', important: false, notes: 'Prescribed pain relief medication' },
        // Add more historical data here
    ];

    const [visitHistoryData, setVisitHistoryData] = useState(initialData);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedDiagnosis, setSelectedDiagnosis] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedVisit, setSelectedVisit] = useState(null);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSort = () => {
        const sortedData = [...visitHistoryData].sort((a, b) => {
            if (sortOrder === 'asc') {
                return new Date(a.date) - new Date(b.date);
            } else {
                return new Date(b.date) - new Date(a.date);
            }
        });
        setVisitHistoryData(sortedData);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const handleDoctorFilter = (event) => {
        setSelectedDoctor(event.target.value);
    };

    const handleDiagnosisFilter = (event) => {
        setSelectedDiagnosis(event.target.value);
    };

    const handleDateFilter = () => {
        const filteredData = initialData.filter((visit) => {
            const visitDate = new Date(visit.date);
            const start = startDate ? new Date(startDate) : new Date('1900-01-01');
            const end = endDate ? new Date(endDate) : new Date();
            return visitDate >= start && visitDate <= end;
        });
        setVisitHistoryData(filteredData);
    };

    const handleImportantToggle = (index) => {
        const updatedData = [...visitHistoryData];
        updatedData[index].important = !updatedData[index].important;
        setVisitHistoryData(updatedData);
    };

    const handleVisitClick = (visit) => {
        setSelectedVisit(visit);
    };

    const handleCloseModal = () => {
        setSelectedVisit(null);
    };

    const filteredData = visitHistoryData.filter((visit) =>
        (visit.date.includes(searchTerm) ||
            visit.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            visit.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedDoctor === '' || visit.doctor === selectedDoctor) &&
        (selectedDiagnosis === '' || visit.diagnosis === selectedDiagnosis)
    );

    const colors = ['#ffcccc', '#ccffcc', '#ccccff', '#ffcc99', '#99ccff', '#ff99cc'];

    return (
        <div className="visit-history">
            <div className='header-text'>
                <h2>Medical History</h2>
            </div>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by date, doctor, or diagnosis..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <button onClick={handleSort}>
                    Sort by Date ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
                </button>
            </div>
            <div className="filters">
                <select value={selectedDoctor} onChange={handleDoctorFilter}>
                    <option value="">All Doctors</option>
                    {Array.from(new Set(visitHistoryData.map(visit => visit.doctor))).map(doctor => (
                        <option key={doctor} value={doctor}>{doctor}</option>
                    ))}
                </select>
                <select value={selectedDiagnosis} onChange={handleDiagnosisFilter}>
                    <option value="">All Diagnoses</option>
                    {Array.from(new Set(visitHistoryData.map(visit => visit.diagnosis))).map(diagnosis => (
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
                <CSVLink data={visitHistoryData} filename={"medical-history.csv"}>
                    <button>Export to CSV</button>
                </CSVLink>
            </div>
            <div className="timetable">
                <div className="timetable-header">
                    <div className="timetable-header-item">Date</div>
                    <div className="timetable-header-item">Doctor</div>
                    <div className="timetable-header-item">Diagnosis</div>
                    <div className="timetable-header-item">Important</div>
                </div>
                {filteredData.map((visit, index) => (
                    <div
                        key={index}
                        className="timetable-row"
                        style={{
                            backgroundColor: visit.important ? '#ffcc00' : colors[index % colors.length],
                            fontWeight: visit.important ? 'bold' : 'normal'
                        }}
                        title={`Visit on ${visit.date} with ${visit.doctor} for ${visit.diagnosis}`}
                        onClick={() => handleVisitClick(visit)}
                    >
                        <div className="timetable-item">{visit.date}</div>
                        <div className="timetable-item">{visit.doctor}</div>
                        <div className="timetable-item">{visit.diagnosis}</div>
                        <div className="timetable-item">
                            <input
                                type="checkbox"
                                checked={visit.important}
                                onChange={() => handleImportantToggle(index)}
                            />
                        </div>
                    </div>
                ))}
            </div>
            {selectedVisit && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-button" onClick={handleCloseModal}>&times;</span>
                        <h2>Medical History Details</h2>
                        <p><strong>Date:</strong> {selectedVisit.date}</p>
                        <p><strong>Doctor:</strong> {selectedVisit.doctor}</p>
                        <p><strong>Diagnosis:</strong> {selectedVisit.diagnosis}</p>
                        <p><strong>Notes:</strong> {selectedVisit.notes}</p>
                        <p><strong>Important:</strong> {selectedVisit.important ? 'Yes' : 'No'}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MedicalHistory;
