import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import './AddSlot.scss';
import { useNavigate } from "react-router-dom";

const AddSlot = () => {
    const [veterians, setVeterians] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
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
                date: selectedDate
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
                // Validate the date format (YYYY-MM-DD)
                const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(selectedDate);
                if (!isValidDate) {
                    alert("Please enter a valid date in the format YYYY-MM-DD");
                    return;
                }

                const slotsData = selectedSlots.map(slotId => ({
                    userId: selectedVeterinarian,
                    slotId,
                    date: selectedDate
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
                return [...prev, slotId].slice(0, 8); // Max 10 slots
            }
        });
    };

    return (
        <>
            <div className='slot-scheduler'>
                <button className="back-button" onClick={handleBack}>Back</button>
                <h2 className="my-4">Schedule Veterinarian Slot</h2>

                <div className="date-input">
                    <label htmlFor="date">Enter Date (YYYY-MM-DD):</label>
                    <input
                        type="text"
                        id="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
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
                        {[1, 2, 3, 4, 5, 6,7,8].map((slot) => (
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
