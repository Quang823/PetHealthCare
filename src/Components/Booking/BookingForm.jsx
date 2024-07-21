import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './BookingForm.scss';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

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
                    const response = await axios.get(`http://localhost:8080/pet/getAll/${userID}`);
                    if (response.data && Array.isArray(response.data)) {
                        setPets(response.data);
                    } else {
                        setPets([]);
                    }
                }
            } catch (error) {
                setPets([]);
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
            const selectedDoctorDetail = doctors.find(doctor => doctor.name === selectedDoctor);
            if (selectedDoctor && selectedDate) {
                const formattedDate = selectedDate.toISOString().split('T')[0];
                const slotsData = await axios.post(`http://localhost:8080/sev-slot/slot-available`, {
                    userId: selectedDoctorDetail.userId,
                    date: formattedDate
                });
                setSlots(Array.isArray(slotsData.data) ? slotsData.data : []);
            } else {
                setSlots([]); // Clear slots if no doctor is selected
            }
        };
        fetchSlots();
    }, [selectedDoctor, selectedDate]);

    useEffect(() => {
        const service = services.find(s => s.name === selectedService);
        setTotalCost(service ? service.price : 0);
    }, [selectedService, services]);

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

        // Store booking information and selected date in localStorage
        localStorage.setItem('bookedInfo', JSON.stringify([newBooking]));
        localStorage.setItem('selectedDate', selectedDate.toLocaleDateString('en-CA'));

        // Call onBookingComplete and pass newBooking object
        onBookingComplete(newBooking);

        // Reset form
        setSelectedPet('');
        setSelectedService('');
        setSelectedDoctor('');
        setSelectedSlot('');
        setTotalCost(0);
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

    // const filterSlots = (slots) => {
    //     const now = new Date();
    //     const today = new Date();
    //     today.setHours(0, 0, 0, 0);
    //     const currentHour = now.getHours();
    //     console.log("curHour", currentHour);

    //     return slots.filter(slot => {
    //         const slotHour = parseInt(slot.slot.startTime.split(':')[0], 10);
    //         console.log("slotHour", slotHour);
    //         return  slotHour > currentHour;
    //     });
    // };
    const filterSlots = (slots) => {
        const now = new Date();
        const currentHour = now.getHours();

        console.log("currentHour", currentHour);
        console.log("selectedDate", selectedDate);

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
                console.log("slotHour", slotHour);
                return slotHour > currentHour;
            });
        } else {
            return slots;
        }
    };


    return (
        <div>
            <div className="booking-container">
                <h3>Book an Appointment</h3>
                <form>
                    <label>
                        Select Date:
                        <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            minDate={new Date()}
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
                                <option key={doctor.name} value={doctor.name}>
                                    {doctor.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Select Slot:
                        <div className="slots-grid">
                            {filterSlots(slots).filter(slot => !bookedSlots[selectedDoctor]?.includes(slot.slot.slotId.toString())).map((slot) => {
                                return (
                                    <button
                                        key={slot.slot.slotId}
                                        className={`slot-button ${selectedSlot === slot.slot.slotId ? 'selected' : ''}`}
                                        onClick={(e) => handleSlotSelection(e, slot.slot.slotId)}
                                    >
                                        Slot: {slot.slot.slotId}-{slot.slot.startTime}
                                    </button>
                                );
                            })}
                        </div>
                    </label>
                    <button type="button" onClick={handleBooking}>Book Appointment</button>
                </form>
                <div className="booking-total-cost">Total Cost: ${totalCost.toFixed(2)}</div>
            </div>
        </div>
    );
};


{/* // const BookingForm = ({ onBookingComplete, bookedSlots }) => {
//     const [userID, setUserID] = useState('');
//     const [pets, setPets] = useState([]);
//     const [services, setServices] = useState([]);
//     const [doctors, setDoctors] = useState([]);
//     const [slots, setSlots] = useState([]);
//     const [selectedPet, setSelectedPet] = useState('');
//     const [selectedService, setSelectedService] = useState('');
//     const [selectedDoctor, setSelectedDoctor] = useState('');
//     const [selectedSlot, setSelectedSlot] = useState('');
//     const [selectedDate, setSelectedDate] = useState(new Date());
//     const [totalCost, setTotalCost] = useState(0);

//     useEffect(() => {
//         const fetchUserID = () => {
//             const token = localStorage.getItem('token');
//             if (token) {
//                 const decodedToken = jwtDecode(token);
//                 setUserID(decodedToken.User.map.userID);
//             }
//         };

//         fetchUserID();
//     }, []);

//     useEffect(() => {
//         const fetchPets = async () => {
//             try {
//                 if (userID) {
//                     const response = await axios.get(`http://localhost:8080/pet/getAll/${userID}`);
//                     if (response.data && Array.isArray(response.data)) {
//                         setPets(response.data);
//                     } else {
//                         setPets([]);
//                     }
//                 }
//             } catch (error) {
//                 setPets([]);
//             }
//         };

//         const fetchData = async () => {
//             const servicesData = await axios.get(`http://localhost:8080/Service/getAll`);
//             setServices(Array.isArray(servicesData.data) ? servicesData.data : []);

//             const doctorsData = await axios.get(`http://localhost:8080/account/getVeterinarian`);
//             setDoctors(Array.isArray(doctorsData.data) ? doctorsData.data : []);
//         };

//         if (userID) {
//             fetchPets();
//         }
//         fetchData();
//     }, [userID]);

//     useEffect(() => {
//         const fetchSlots = async () => {
//             const selectedDoctorDetail = doctors.find(doctor => doctor.name === selectedDoctor);
//             if (selectedDoctor && selectedDate) {
//                 const formattedDate = selectedDate.toISOString().split('T')[0];
//                 const slotsData = await axios.post(`http://localhost:8080/sev-slot/slot-available`, {
//                     userId: selectedDoctorDetail.userId,
//                     date: formattedDate
//                 });
//                 setSlots(Array.isArray(slotsData.data) ? slotsData.data : []);
//             } else {
//                 setSlots([]); // Clear slots if no doctor is selected
//             }
//         };
//         fetchSlots();
//     }, [selectedDoctor, selectedDate]);

//     useEffect(() => {
//         const service = services.find(s => s.name === selectedService);
//         setTotalCost(service ? service.price : 0);
//     }, [selectedService, services]);

//     const handleBooking = async () => {
//         if (!selectedPet || !selectedService || !selectedDoctor || !selectedSlot || !selectedDate) {
//             toast.error('Please fill in all fields before booking.');
//             return;
//         }

//         const selectedServiceDetail = services.find(service => service.name === selectedService);
//         const selectedSlotDetail = slots.find(slot => slot.slot.slotId === parseInt(selectedSlot, 10));
//         const selectedPetDetail = pets.find(pet => pet.petName === selectedPet);
//         const selectedDoctorDetail = doctors.find(doctor => doctor.name === selectedDoctor);

//         const newBooking = {
//             petId: selectedPetDetail?.petId,
//             petName: selectedPetDetail?.petName,
//             serviceId: selectedServiceDetail?.serviceId,
//             serviceName: selectedServiceDetail?.name,
//             doctorId: selectedDoctorDetail?.userId,
//             doctorName: selectedDoctorDetail?.name,
//             slotTime: selectedSlotDetail?.slot.slotId,
//             totalCost: selectedServiceDetail?.price,
//             date: selectedDate.toISOString().split('T')[0]
//         };

//         // Store booking information and selected date in localStorage
//         localStorage.setItem('bookedInfo', JSON.stringify([newBooking]));
//         localStorage.setItem('selectedDate', selectedDate.toISOString().split('T')[0]);

//         // Call onBookingComplete and pass newBooking object
//         onBookingComplete(newBooking);

//         // Reset form
//         setSelectedPet('');
//         setSelectedService('');
//         setSelectedDoctor('');
//         setSelectedSlot('');
//         setTotalCost(0);
//     };

//     const handleDateChange = (date) => {
//         setSelectedDate(date);
//         localStorage.setItem('selectedDate', date.toISOString().split('T')[0]);
//     };

//     const validateDate = (date) => {
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);
//         return date >= today;
//     };

//     const handleSlotSelection = (e, slotId) => {
//         e.preventDefault();
//         setSelectedSlot(slotId);
//     };

//     return (
//         <div>
//             <div className="booking-container">
//                 <h3>Book an Appointment</h3>
//                 <form>
//                     <label>
//                         Select Date:
//                         <DatePicker
//                             selected={selectedDate}
//                             onChange={handleDateChange}
//                             minDate={new Date()}
//                             filterDate={validateDate}
//                             dateFormat="yyyy-MM-dd"
//                         />
//                     </label>
//                     <label>
//                         Select Pet:
//                         <select value={selectedPet} onChange={(e) => setSelectedPet(e.target.value)}>
//                             <option value="">Select Pet</option>
//                             {pets.map((pet) => (
//                                 <option key={pet.petName} value={pet.petName}>
//                                     {pet.petName}
//                                 </option>
//                             ))}
//                         </select>
//                     </label>
//                     <label>
//                         Select Service:
//                         <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
//                             <option value="">Select Service</option>
//                             {services.map((service) => (
//                                 <option key={service.name} value={service.name}>
//                                     {service.name} - ${service.price}
//                                 </option>
//                             ))}
//                         </select>
//                     </label>
//                     <label>
//                         Select Doctor:
//                         <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)}>
//                             <option value="">Select Doctor</option>
//                             {doctors.map((doctor) => (
//                                 <option key={doctor.name} value={doctor.name}>
//                                     {doctor.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </label>
//                     <label>
//                         Select Slot:
//                         <div className="slots-grid">
//                             {slots.filter(slot => !bookedSlots[selectedDoctor]?.includes(slot.slot.slotId.toString())).map((slot) => {
//                                 return (
//                                     <button
//                                         key={slot.slot.slotId}
//                                         className={`slot-button ${selectedSlot === slot.slot.slotId ? 'selected' : ''}`}
//                                         onClick={(e) => handleSlotSelection(e, slot.slot.slotId)}
//                                     >
//                                         Slot: {slot.slot.slotId}-{slot.slot.startTime}
//                                     </button>
//                                 );
//                             })}
//                         </div>
//                     </label>
//                     <button type="button" onClick={handleBooking}>Book Appointment</button>
//                 </form>
//                 <div className="booking-total-cost">Total Cost: ${totalCost.toFixed(2)}</div>
//             </div>
//         </div>
//     );
// }; */}


export default BookingForm;