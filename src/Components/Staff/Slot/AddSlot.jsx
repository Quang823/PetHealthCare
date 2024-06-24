
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import './AddSlot.scss';
import { useNavigate } from "react-router-dom";
const AddSlot = () => {
    const [veterians, setVeterians] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedVeterinarian, setSelectedVeterinarian] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState('');
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
        if (selectedVeterinarian && selectedDate && selectedSlot) {
            try {
                // Validate the date format (YYYY-MM-DD)
                const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(selectedDate);
                if (!isValidDate) {
                    alert("Please enter a valid date in the format YYYY-MM-DD");
                    return;
                }


                const data = {
                    userId: selectedVeterinarian,
                    slotId: selectedSlot,
                    date: selectedDate
                };
                const res = await axios.post("http://localhost:8080/sev-slot/add", data);
                console.log(res.data);
                toast.success("Add slot success");

                // Refresh the available slots after adding a new slot
                checkSlotAvailability();
            } catch (err) {
                console.log(err);
                toast.error("ServiceSlot is existed");
            }
        } else {
            alert("Please select a veterinarian, enter a date, and select a slot.");
        }
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
                    <label htmlFor="slot">Select Slot:</label>
                    <select
                        id="slot"
                        value={selectedSlot}
                        onChange={(e) => setSelectedSlot(e.target.value)}
                        className="form-control"
                    >
                        <option value="">Select Slot</option>
                        {[1, 2, 3, 4, 5, 6].map((slot) => (
                            <option key={slot} value={slot} disabled={availableSlots.some(s => s.slot.slotId === slot)}>
                                Slot {slot} {availableSlots.some(s => s.slot.slotId === slot) && '(Booked)'}
                            </option>
                        ))}
                    </select>
                </div>
                <button onClick={handleSlotAdd} className="btn btn-primary mt-3">Add Slot</button>
            </div>
        </>
    );
};

export default AddSlot;
