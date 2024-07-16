import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './AddSlot.scss';
import { useNavigate } from "react-router-dom";

const AddSlot = () => {
    const [veterinarians, setVeterinarians] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedVeterinarian, setSelectedVeterinarian] = useState(null);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchVeterinarians();
    }, []);

    useEffect(() => {
        if (selectedDate && selectedVeterinarian) {
            checkSlotAvailability();
        }
    }, [selectedDate, selectedVeterinarian]);

    const fetchVeterinarians = async () => {
        try {
            const res = await axios.get("http://localhost:8080/account/getVeterinarian");
            setVeterinarians(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch veterinarians");
        }
    };

    const checkSlotAvailability = async () => {
        try {
            const data = {
                userId: selectedVeterinarian,
                date: selectedDate.toISOString().split("T")[0]
            };
            const res = await axios.post("http://localhost:8080/sev-slot/slot-not-create", data);
            setAvailableSlots(res.data);
            console.log("Available slots:", res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to check slot availability");
        }
    };

    const handleSlotAdd = async () => {
        if (selectedVeterinarian && selectedDate && selectedSlots.length > 0) {
            try {
                const slotsData = selectedSlots.map(slotId => ({
                    userId: selectedVeterinarian,
                    slotId,
                    date: selectedDate.toISOString().split("T")[0]
                }));

                const res = await axios.post("http://localhost:8080/sev-slot/add", slotsData);
                toast.success("Slots added successfully");

                checkSlotAvailability();
                setSelectedSlots([]);
            } catch (err) {
                console.error(err);
                toast.error("Failed to add slots");
            }
        } else {
            toast.warning("Please select a veterinarian, date, and at least one slot");
        }
    };

    const handleSlotSelection = (slotId) => {
        setSelectedSlots(prev => {
            if (prev.includes(slotId)) {
                return prev.filter(id => id !== slotId);
            } else {
                return [...prev, slotId].slice(0, 8);
            }
        });
    };

    return (
        <div className='slot-scheduler'>
            <h2 className="my-4">Schedule Veterinarian Slot</h2>

            <div className="date-input">
                <label htmlFor="date">Enter Date:</label>
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="yyyy-MM-dd"
                    minDate={new Date()}
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
                    {veterinarians.map((vet) => (
                        <option key={vet.userId} value={vet.userId}>
                            {vet.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className='slot-picker'>
                <label htmlFor="slot">Select Slots:</label>
                <div className="slot-container">
                    <div className="slot-group">
                        {[1, 2, 3, 4].map((slot) => (
                            <div key={slot} className="slot-item">
                                <input
                                    type="checkbox"
                                    value={slot}
                                    onChange={() => handleSlotSelection(slot)}
                                    disabled={availableSlots.some(s => s.slot.slotId === slot)}
                                    checked={selectedSlots.includes(slot)}
                                />
                                <label>
                                    Slot {slot} {availableSlots.some(s => s.slot.slotId === slot) && '(Created)'}
                                </label>
                            </div>
                        ))}
                    </div>
                    <div className="slot-group">
                        {[5, 6, 7, 8].map((slot) => (
                            <div key={slot} className="slot-item">
                                <input
                                    type="checkbox"
                                    value={slot}
                                    onChange={() => handleSlotSelection(slot)}
                                    disabled={availableSlots.some(s => s.slot.slotId === slot)}
                                    checked={selectedSlots.includes(slot)}
                                />
                                <label>
                                    Slot {slot} {availableSlots.some(s => s.slot.slotId === slot) && '(Created)'}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <button onClick={handleSlotAdd} className="btn btn-primary mt-3">Add Slots</button>
        </div>
    );
};

export default AddSlot;
