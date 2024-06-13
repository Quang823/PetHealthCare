// src/services/bookingService.js
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const mockPets = [
    { id: '1', name: 'Dog Thinh' },
    { id: '2', name: 'Dog An' },
    { id: '3', name: 'Cat Đạt' },
];

const mockServices = [
    { id: '1', name: 'Service 1', price: 100 },
    { id: '2', name: 'Service 2', price: 200 },
    { id: '3', name: 'Service 3', price: 300 },
];

const mockDoctors = [
    { id: '1', name: 'Doctor 1' },
    { id: '2', name: 'Doctor 2' },
    { id: '3', name: 'Doctor 3' },
];

const mockSlots = [
    { id: '1', time: '09:00 AM' },
    { id: '2', time: '10:00 AM' },
    { id: '3', time: '11:00 AM' },
];

export const getPets = async () => {
    await delay(100); // Giả lập độ trễ
    return { data: mockPets };
};

export const getServices = async () => {
    await delay(100); // Giả lập độ trễ
    return { data: mockServices };
};

export const getDoctors = async () => {
    await delay(100); // Giả lập độ trễ
    return { data: mockDoctors };
};

export const getSlots = async (doctorId) => {
    await delay(100); // Giả lập độ trễ
    return { data: mockSlots };
};

export const bookAppointment = async (bookingData) => {
    await delay(100); // Giả lập độ trễ
    return { data: { success: true } };
};