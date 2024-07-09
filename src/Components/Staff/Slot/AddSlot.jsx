import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './AddSlot.scss';
import { useNavigate } from "react-router-dom";

const AddSlot = () => {
    const [veterians, setVeterians] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date()); // Ngày hiện tại là ngày mặc định
    const [selectedVeterinarian, setSelectedVeterinarian] = useState(null);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/staff');
    };

    useEffect(() => {
        fetchVeterians();
    }, []);

    useEffect(() => {
        if (selectedDate && selectedVeterinarian) {
            checkSlotAvailability();
        }
    }, [selectedDate, selectedVeterinarian]);

    const fetchVeterians = async () => {
        try {
            const res = await axios.get("http://localhost:8080/account/getVeterinarian");
            setVeterians(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const checkSlotAvailability = async () => {
        try {
            const data = {
                userId: selectedVeterinarian,
                date: selectedDate.toISOString().split("T")[0] // format date to YYYY-MM-DD
            };
            const res = await axios.post("http://localhost:8080/sev-slot/slot-available", data);
            setAvailableSlots(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleSlotAdd = async () => {
        if (selectedVeterinarian && selectedDate && selectedSlots.length > 0) {
            try {
                const slotsData = selectedSlots.map(slotId => ({
                    userId: selectedVeterinarian,
                    slotId,
                    date: selectedDate.toISOString().split("T")[0] // format date to YYYY-MM-DD
                }));

                const res = await axios.post("http://localhost:8080/sev-slot/add", slotsData);
                console.log(res.data);
                toast.success("Add slots success");

                // Refresh the available slots after adding new slots
                checkSlotAvailability();
                // Clear the selected slots
                setSelectedSlots([]);
            } catch (err) {
                console.log(err);
                toast.error("ServiceSlot is existed");
            }
        } else {
            alert("Please select a veterinarian, enter a date, and select at least one slot.");
        }
    };

    const handleSlotSelection = (slotId) => {
        setSelectedSlots(prev => {
            if (prev.includes(slotId)) {
                return prev.filter(id => id !== slotId);
            } else {
                return [...prev, slotId].slice(0, 8); // Max 8 slots
            }
        });
    };

    return (
        <>
            <div className='slot-scheduler'>
                
                <h2 className="my-4">Schedule Veterinarian Slot</h2>

                <div className="date-input">
                    <label htmlFor="date">Enter Date:</label>
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        dateFormat="yyyy-MM-dd"
                        minDate={new Date()} // Chỉ cho phép chọn ngày từ ngày hiện tại trở đi
                        className="form-control"
                    />
                </div>
                <div className='vet-picker'>
                    <label htmlFor="veterinarian">Select Veterinarian:</label>
                    <select
                        id="veterinarian"
                        value={selectedVeterinarian}
                        onChange={(e) => setSelectedVeterinarian(e.target.value)}
                        className="form-control"
                    >
                        <option value="">Select Veterinarian</option>
                        {veterians.map((vet) => (
                            <option key={vet.userId} value={vet.userId}>
                                {vet.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='slot-picker'>
                    <label htmlFor="slot">Select Slots:</label>
                    <div id="slot" className="form-control">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((slot) => (
                            <div key={slot}>
                                <input
                                    type="checkbox"
                                    value={slot}
                                    onChange={() => handleSlotSelection(slot)}
                                    disabled={availableSlots.some(s => s.slot.slotId === slot)}
                                    checked={selectedSlots.includes(slot)}
                                />
                                <label>Slot {slot} {availableSlots.some(s => s.slot.slotId === slot) && '(Booked)'}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <button onClick={handleSlotAdd} className="btn btn-primary mt-3">Add Slots</button>
            </div>
        </>
    );
};

export default AddSlot;
