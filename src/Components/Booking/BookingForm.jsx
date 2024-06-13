import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getServices, getDoctors, getSlots, bookAppointment } from './MockData';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './BookingForm.scss';
import { jwtDecode } from "jwt-decode";

const BookingForm = ({ onBookingComplete }) => {
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

    useEffect(() => {
        const fetchUserID = () => {
            const token = localStorage.getItem('token');
            if (token) {
                const decodedToken = jwtDecode(token);
                setUserID(decodedToken.User.userID);
            }
        };

        fetchUserID();
    }, []);

    useEffect(() => {
        const fetchPets = async () => {
            try {
                if (userID) {
                    const response = await axios.get(`http://localhost:8080/pet/getAll/${userID}`);
                    console.log('Pets data:', response.data); // Log dữ liệu thú cưng để kiểm tra
                    if (response.data && Array.isArray(response.data)) {
                        setPets(response.data);
                        console.log('Pets data:', response); 
                    } else {
                        console.error('Pets data is not an array:', response.data);
                        setPets([]);
                    }
                }
            } catch (error) {
                console.error('Error fetching pets:', error);
                setPets([]);  // Trả về mảng rỗng nếu có lỗi
            }
        };

        const fetchData = async () => {
            const servicesData = await getServices();
            setServices(Array.isArray(servicesData.data) ? servicesData.data : []);
            console.log('service',servicesData.data);
            const doctorsData = await getDoctors();
            setDoctors(Array.isArray(doctorsData.data) ? doctorsData.data : []);
        };

        if (userID) {
            fetchPets();
        }
        fetchData();
    }, [userID]);

    useEffect(() => {
        const fetchSlots = async () => {
            if (selectedDoctor && selectedDate) {
                const formattedDate = selectedDate.toISOString().split('T')[0];
                const slotsData = await getSlots(selectedDoctor, formattedDate);
                setSlots(Array.isArray(slotsData.data) ? slotsData.data : []);
            }
        };
        fetchSlots();
    }, [selectedDoctor, selectedDate]);

    useEffect(() => {
        const service = services.find(s => s.id === selectedService);
        setTotalCost(service ? service.price : 0);
    }, [selectedService, services]);

    const handleBooking = async () => {
        const bookingData = {
            petId: selectedPet,
            serviceId: selectedService,
            doctorId: selectedDoctor,
            slotId: selectedSlot
        };
        await bookAppointment(bookingData);
        const selectedServiceDetail = services.find(service => service.id === selectedService);
        onBookingComplete({
            petName: pets.find(pet => pet.id === selectedPet)?.name,
            serviceName: selectedServiceDetail?.name,
            doctorName: doctors.find(doctor => doctor.id === selectedDoctor)?.name,
            slotTime: slots.find(slot => slot.id === selectedSlot)?.time,
            totalCost: selectedServiceDetail?.price
        });
        // Reset form
        setSelectedPet('');
        setSelectedService('');
        setSelectedDoctor('');
        setSelectedSlot('');
        setTotalCost(0);
    };

    return (
        <div className="booking-container">
            <h2>Book an Appointment</h2>
            <form>
                <label>
                    Select Date:
                    <DatePicker
                        selected={selectedDate}
                        onChange={date => setSelectedDate(date)}
                        dateFormat="yyyy-MM-dd"
                    />
                </label>
                <label>
                    Select Pet:
                    <select value={selectedPet} onChange={(e) => setSelectedPet(e.target.value)}>
                        <option value="">Select Pet</option>
                        {pets.map((pet) => (
                            <option key={pet.petId} value={pet.petId}>
                                {pet.petname}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Select Service:
                    <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
                        <option value="">Select Service</option>
                        {services.map((service) => (
                            <option key={service.id} value={service.id}>
                                {service.name} - ${service.price}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Select Doctor:
                    <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)}>
                        <option value="">Select Doctor</option>
                        {doctors.map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>
                                {doctor.name}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Select Slot:
                    <select value={selectedSlot} onChange={(e) => setSelectedSlot(e.target.value)}>
                        <option value="">Select Slot</option>
                        {slots.map((slot) => (
                            <option key={slot.id} value={slot.id}>
                                {slot.time}
                            </option>
                        ))}
                    </select>
                </label>
                <p>Cost: ${totalCost}</p>
                <button type="button" onClick={handleBooking}>Book</button>
            </form>
        </div>
    );
};

export default BookingForm;