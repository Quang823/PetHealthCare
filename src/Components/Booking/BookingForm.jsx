
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './BookingForm.scss';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

const BookingForm = ({ onBookingComplete, bookedSlots }) => {
    const [userID, setUserID] = useState('');
    const [pets, setPets] = useState([]);
    const [services, setServices] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [slots, setSlots] = useState([]);
    const [selectedPet, setSelectedPet] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [totalCost, setTotalCost] = useState(0);

    const location = useLocation();
    const { selectedService: initialService, selectedPet: initialPet, selectedDoctor: initialDoctor } = location.state || {};

    useEffect(() => {
        const fetchUserID = () => {
            const token = localStorage.getItem('token');
            if (token) {
                const decodedToken = jwtDecode(token);
                setUserID(decodedToken.User.map.userID);
            }
        };

        fetchUserID();
    }, []);

    useEffect(() => {
        const fetchPets = async () => {
            try {
                if (userID) {
                    const response = await axios.get(`http://localhost:8080/pet/getPet/${userID}`);
                    setPets(response.data && Array.isArray(response.data) ? response.data : []);
                }
            } catch (error) {
                setPets([]);
            }
        };

        const fetchData = async () => {
            try {
                const servicesData = await axios.get(`http://localhost:8080/Service/getAll`);
                setServices(Array.isArray(servicesData.data) ? servicesData.data : []);

                const doctorsData = await axios.get(`http://localhost:8080/account/getVeterinarian`);
                setDoctors(Array.isArray(doctorsData.data) ? doctorsData.data : []);
            } catch (error) {
                setServices([]);
                setDoctors([]);
            }
        };

        if (userID) {
            fetchPets();
        }
        fetchData();
    }, [userID]);

    useEffect(() => {
        const fetchSlots = async () => {
            const selectedDoctorDetail = doctors.find(doctor => doctor.name === selectedDoctor);
            if (selectedDoctor && selectedDate) {
                const formattedDate = selectedDate.toISOString().split('T')[0];
                try {
                    const slotsData = await axios.post(`http://localhost:8080/sev-slot/slot-available`, {
                        userId: selectedDoctorDetail.userId,
                        date: formattedDate
                    });
                    setSlots(Array.isArray(slotsData.data) ? slotsData.data : []);
                } catch (error) {
                    setSlots([]);
                }
            } else {
                setSlots([]);
            }
        };
        fetchSlots();
    }, [selectedDoctor, selectedDate, doctors]);

    useEffect(() => {
        const service = services.find(s => s.name === selectedService);
        setTotalCost(service ? service.price : 0);
    }, [selectedService, services]);

    useEffect(() => {
        // Set initial values from state if provided
        if (initialService) setSelectedService(initialService);
        if (initialPet) setSelectedPet(initialPet);
        if (initialDoctor) setSelectedDoctor(initialDoctor);
    }, [initialService, initialPet, initialDoctor]);

    const filterSlots = (slots) => {
        const now = new Date();
        const currentHour = now.getHours();

        // Get existing bookings from local storage
        const existingBookings = JSON.parse(localStorage.getItem('bookings')) || [];

        // Check if a slot is booked
        const isSlotBooked = (slot) => {
            return existingBookings.some(booking => {
                const isSameDate = booking.date === selectedDate.toLocaleDateString('en-CA');
                const isSamePet = booking.petId === pets.find(pet => pet.petName === selectedPet)?.petId;
                const isSameDoctor = booking.doctorId === doctors.find(doctor => doctor.name === selectedDoctor)?.userId;
                const isSameSlot = booking.slotTime === slot.slot.slotId;

                // Get the serviceId of the selected service
                const selectedServiceId = services.find(service => service.name === selectedService)?.serviceId;
                const isSameService = booking.serviceId === selectedServiceId;

                // Check if the booking matches the selected date, doctor, slot, and service
                const isExactMatch = isSameDate && isSamePet && isSameDoctor && isSameSlot && isSameService;
                const isServiceOnlyChange = isSameDate && isSamePet && isSameDoctor && isSameSlot && !isSameService;
                const isPetOnlyChange = isSameDate && !isSamePet && isSameDoctor && isSameSlot && isSameService;
                const isPetAndServiceChange = isSameDate && !isSamePet && isSameDoctor && isSameSlot && !isSameService;
                const isDoctorOnlyChange = isSameDate && isSamePet && !isSameDoctor && isSameSlot && isSameService;

                return isExactMatch || isServiceOnlyChange || isPetOnlyChange || isPetAndServiceChange || isDoctorOnlyChange;
            });
        };

        const isSameDay = (date1, date2) => {
            return (
                date1.getDate() === date2.getDate() &&
                date1.getMonth() === date2.getMonth() &&
                date1.getFullYear() === date2.getFullYear()
            );
        };

        if (isSameDay(selectedDate, now)) {
            return slots.filter(slot => {
                const slotHour = parseInt(slot.slot.startTime.split(':')[0], 10);
                return slotHour > currentHour && !isSlotBooked(slot);
            });
        } else {
            return slots.filter(slot => !isSlotBooked(slot));
        }
    };

    const handleBooking = async () => {
        if (!selectedPet || !selectedService || !selectedDoctor || !selectedSlot || !selectedDate) {
            toast.error('Please fill in all fields before booking.');
            return;
        }

        const selectedServiceDetail = services.find(service => service.name === selectedService);
        const selectedSlotDetail = slots.find(slot => slot.slot.slotId === parseInt(selectedSlot, 10));
        const selectedPetDetail = pets.find(pet => pet.petName === selectedPet);
        const selectedDoctorDetail = doctors.find(doctor => doctor.name === selectedDoctor);

        const newBooking = {
            petId: selectedPetDetail?.petId,
            petName: selectedPetDetail?.petName,
            serviceId: selectedServiceDetail?.serviceId,
            serviceName: selectedServiceDetail?.name,
            doctorId: selectedDoctorDetail?.userId,
            doctorName: selectedDoctorDetail?.name,
            slotTime: selectedSlotDetail?.slot.slotId,
            totalCost: selectedServiceDetail?.price,
            date: selectedDate.toLocaleDateString('en-CA') // Formats date as YYYY-MM-DD
        };

        try {
            const response = { status: 200 };

            if (response.status === 200) {
                onBookingComplete(newBooking);

                // Save booking details to local storage
                const existingBookings = JSON.parse(localStorage.getItem('bookings')) || [];
                existingBookings.push(newBooking);
                localStorage.setItem('bookings', JSON.stringify(existingBookings));

                // Clear fields as necessary
                //setSelectedPet('');
                //setSelectedService('');
                //setSelectedDoctor('');
                //setSelectedSlot('');
                setTotalCost(0);
            } else {
                throw new Error('Booking failed');
            }
        } catch (error) {
            toast.error('Booking failed: ' + error.message);
        }
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        localStorage.setItem('selectedDate', date.toLocaleDateString('en-CA'));
    };

    const validateDate = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
    };

    const handleSlotSelection = (e, slotId) => {
        e.preventDefault();
        setSelectedSlot(slotId);
    };

    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 1);

    return (
        <div className="booking-container">
            <h3>Book an Appointment</h3>
            <form>
                <label>
                    Select Date:
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        minDate={new Date()}
                        maxDate={maxDate}
                        filterDate={validateDate}
                        dateFormat="yyyy-MM-dd"
                    />
                </label>
                <label>
                    Select Pet:
                    <select value={selectedPet} onChange={(e) => setSelectedPet(e.target.value)}>
                        <option value="">Select Pet</option>
                        {pets.map((pet) => (
                            <option key={pet.petName} value={pet.petName}>
                                {pet.petName}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Select Service:
                    <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
                        <option value="">Select Service</option>
                        {services.map((service) => (
                            <option key={service.name} value={service.name}>
                                {service.name} - {service.price} VND
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Select Doctor:
                    <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)}>
                        <option value="">Select Doctor</option>
                        {doctors.map((doctor) => (
                            <option key={doctor.name} value={doctor.name}>
                                {doctor.name}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Select Slot:
                    <div className="slots-grid">
                        {filterSlots(slots).map((slot) => {
                            const doctorSlots = bookedSlots[selectedDoctor] || [];
                            const isBooked = doctorSlots.some(
                                bookedSlot => bookedSlot.slotId === slot.slot.slotId &&
                                    bookedSlot.date === selectedDate.toLocaleDateString('en-CA')
                            );
                            return (
                                <button
                                    key={slot.slot.slotId}
                                    className={`slot-button ${selectedSlot === slot.slot.slotId ? 'selected' : ''} ${isBooked ? 'disabled' : ''}`}
                                    onClick={(e) => !isBooked && handleSlotSelection(e, slot.slot.slotId)}
                                    disabled={isBooked}
                                >
                                    Slot {slot.slot.slotId}: {slot.slot.startTime}
                                </button>
                            );
                        })}
                    </div>
                </label>
                <label>
                    Total Cost: {totalCost} VND
                </label>
                <button type="button" onClick={handleBooking}>Book Appointment</button>
            </form>
        </div>
    );
};

export default BookingForm;
