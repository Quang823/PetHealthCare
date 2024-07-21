import React, { useState, useEffect } from 'react';
import './EditSlot.scss';
import { toast } from 'react-toastify';

const EditSlot = () => {
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [updateMessage, setUpdateMessage] = useState('');

    useEffect(() => {
        const fetchSlots = async () => {
            const response = await fetch('http://localhost:8080/slot/all');
            const data = await response.json();
            setSlots(data);
        };
        fetchSlots();
    }, []);

    const handleRowClick = (slot) => {
        setSelectedSlot(slot);
        setUpdateMessage(''); // Reset update message
    };

    const handleUpdate = async (updatedSlot) => {
        try {
            const response = await fetch(`http://localhost:8080/slot/update/${updatedSlot.slotId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedSlot),
            });

            if (response.ok) {
                // Handle success response
                setSlots((prevSlots) =>
                    prevSlots.map((slot) =>
                        slot.slotId === updatedSlot.slotId ? updatedSlot : slot
                    )
                );
                setSelectedSlot(null);
                setUpdateMessage('Slot updated successfully');
                toast.success("Slot updated successfully");
            } else {
                // Handle error response
                const errorMessage = await response.text();
                console.error('Failed to update slot:', errorMessage);
                setUpdateMessage(`Failed to update slot: ${errorMessage}`);
                toast.error("Failed to update slot");
            }
        } catch (err) {
            console.error('Error during update:', err.message);
            setUpdateMessage(`Error during update: ${err.message}`);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedSlot((prevSlot) => ({
            ...prevSlot,
            [name]: value,
        }));
    };

    const handleTimeChange = (e) => {
        const { name, value } = e.target;
        const timeWithSeconds = `${value}:00`;
        setSelectedSlot((prevSlot) => ({
            ...prevSlot,
            [name]: timeWithSeconds,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleUpdate(selectedSlot);
    };

    const handleClose = () => {
        setSelectedSlot(null);
        setUpdateMessage('');
    };

    const formatTime = (time) => {
        return time.slice(0, 5); // Lấy phần hh:mm từ hh:mm:ss
    };

    return (
        <div>
            <h1>Slot Management</h1>
            <table className="custom-slot-table">
                <thead>
                    <tr>
                        <th>Slot ID</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                    </tr>
                </thead>
                <tbody>
                    {slots.map((slot) => (
                        <tr key={slot.slotId} onClick={() => handleRowClick(slot)}>
                            <td>{slot.slotId}</td>
                            <td>{slot.startTime}</td>
                            <td>{slot.endTime}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedSlot && (
                <div className="custom-edit-slot-popup">
                    <div className="custom-edit-slot-popup-content">
                        <span className="custom-edit-slot-popup-close" onClick={handleClose}>&times;</span>
                        <h2>Edit Slot</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="custom-edit-slot-form-field">
                                <label className="custom-edit-slot-form-label">Slot ID:</label>
                                <input
                                    type="text"
                                    name="slotId"
                                    value={selectedSlot.slotId}
                                    onChange={handleChange}
                                    className="custom-edit-slot-form-input"
                                    disabled
                                />
                            </div>
                            <div className="custom-edit-slot-form-field">
                                <label className="custom-edit-slot-form-label">Start Time:</label>
                                <input
                                    type="time"
                                    name="startTime"
                                    value={formatTime(selectedSlot.startTime)}
                                    onChange={handleTimeChange}
                                    className="custom-edit-slot-form-input"
                                />
                            </div>
                            <div className="custom-edit-slot-form-field">
                                <label className="custom-edit-slot-form-label">End Time:</label>
                                <input
                                    type="time"
                                    name="endTime"
                                    value={formatTime(selectedSlot.endTime)}
                                    onChange={handleTimeChange}
                                    className="custom-edit-slot-form-input"
                                />
                            </div>
                            <button type="submit" className="custom-edit-slot-form-submit-button">Update Slot</button>
                        </form>
                        {updateMessage && <p>{updateMessage}</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditSlot;
