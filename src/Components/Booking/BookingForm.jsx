import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getServices, getDoctors, getSlots, bookAppointment } from './MockData';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './BookingForm.scss';
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

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
    const [minDate, setMinDate] = useState(null);
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
            const servicesData = await axios.get(`http://localhost:8080/Service/getAll`);
            setServices(Array.isArray(servicesData.data) ? servicesData.data : []);
            

            const doctorsData = await axios.get(`http://localhost:8080/account/getVeterinarian`);
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
        const service2 = services.find(s => s.serviceID === selectedService);
        // setTotalCost(service2 ? service2.price : 0);
    }, [selectedService, services]);

    const handleBooking = async () => {
        if (!selectedPet || !selectedService || !selectedDoctor || !selectedSlot || !selectedDate) {
            toast.error('Please fill in all fields before booking.');
            return;
        }
        const bookingData = {
            petId: selectedPet,
            serviceID: selectedService,
            doctorId: selectedDoctor,
            slotId: selectedSlot,
            date: selectedDate.toISOString().split('T')[0] // Lưu trữ ngày đã chọn
        };
        await bookAppointment(bookingData);
        // const selectedServiceDetail = services.find(service => service.name === selectedService);
        const selectedServiceDetail = services.find(service => service.serviceID === selectedService);
        console.log('service',selectedServiceDetail)
        onBookingComplete({
            petName: pets.find(pet => pet.petname === selectedPet)?.petname,
            serviceName: selectedServiceDetail?.name,
            doctorName: doctors.find(doctor => doctor.id === selectedDoctor)?.name,
            slotTime: slots.find(slot => slot.id === selectedSlot)?.time,
            totalCost: selectedServiceDetail?.price,
            date: selectedDate.toISOString().split('T')[0] // Truyền ngày đã chọn
        });
        // Reset form
        setSelectedPet('');
        setSelectedService('');
        setSelectedDoctor('');
        setSelectedSlot('');
        setTotalCost(0);

    };
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const validateDate = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Đặt giờ và phút về 0 để so sánh ngày một cách chính xác
        return date >= today;
    };

    return (
        <div className="booking-container">
            <h2>Book an Appointment</h2>
            <form>
                <label>
                    Select Date:
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        minDate={new Date()}
                        filterDate={validateDate} // Hạn chế chọn ngày trong quá khứ
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
