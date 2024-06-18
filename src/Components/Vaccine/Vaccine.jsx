import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Vaccine.scss';

// const MedicalHistory = () => {
//     const { petId } = useParams();
//     const [petName, setPetName] = useState('');
//     const [medicalHistory, setMedicalHistory] = useState([]);
//     const [editingVaccine, setEditingVaccine] = useState(null);
//     const [newVaccineData, setNewVaccineData] = useState({
//         name: '',
//         date: '',
//         image: null
//     });

//     useEffect(() => {
//         fetchPetName();
//         fetchMedicalHistory();
//     }, []);

//     const fetchPetName = async () => {
//         try {
//             const response = await axios.get(`http://localhost:8080/pet/${petId}`);
//             setPetName(response.data.petName);
//         } catch (error) {
//             console.error('Error fetching pet name:', error);
//         }
//     };

//     const fetchMedicalHistory = async () => {
//         try {
//             const response = await axios.get(`http://localhost:8080/medicalHistory/${petId}`);
//             setMedicalHistory(response.data);
//         } catch (error) {
//             console.error('Error fetching medical history:', error);
//         }
//     };

//     const handleEditVaccine = (vaccine) => {
//         setEditingVaccine(vaccine);
//         setNewVaccineData({
//             name: vaccine.name,
//             date: vaccine.date,
//             image: vaccine.image
//         });
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setNewVaccineData({
//             ...newVaccineData,
//             [name]: value
//         });
//     };

//     const handleImageChange = (e) => {
//         setNewVaccineData({
//             ...newVaccineData,
//             image: e.target.files[0]
//         });
//     };

//     const handleSaveVaccine = async () => {
//         const formData = new FormData();
//         formData.append('name', newVaccineData.name);
//         formData.append('date', newVaccineData.date);
//         if (newVaccineData.image) {
//             formData.append('image', newVaccineData.image);
//         }

//         try {
//             await axios.put(`http://localhost:8080/medicalHistory/${editingVaccine.id}`, formData);
//             fetchMedicalHistory();
//             setEditingVaccine(null);
//             toast.success('Vaccine information updated successfully');
//         } catch (error) {
//             console.error('Error updating vaccine information:', error);
//             toast.error('Failed to update vaccine information');
//         }
//     };

//     return (
//         <div>
//             <h2>Medical History for {petName}</h2>
//             <table className="styled-table">
//                 <thead>
//                     <tr>
//                         <th>Vaccine Name</th>
//                         <th>Vaccine Date</th>
//                         <th>Image</th>
//                         <th>Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {medicalHistory.map((vaccine, index) => (
//                         <tr key={index}>
//                             <td>{vaccine.name}</td>
//                             <td>{vaccine.date}</td>
//                             <td>
//                                 {vaccine.image && (
//                                     <img src={`http://localhost:8080/images/${vaccine.image}`} alt="Vaccine" width="100" />
//                                 )}
//                             </td>
//                             <td>
//                                 <button className='btn btn-warning' onClick={() => handleEditVaccine(vaccine)}>Edit</button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>

//             {editingVaccine && (
//                 <div className="form-container">
//                     <h3>Edit Vaccine</h3>
//                     <input
//                         type="text"
//                         name="name"
//                         placeholder="Vaccine Name"
//                         value={newVaccineData.name}
//                         onChange={handleInputChange}
//                     />
//                     <input
//                         type="date"
//                         name="date"
//                         placeholder="Vaccine Date"
//                         value={newVaccineData.date}
//                         onChange={handleInputChange}
//                     />
//                     <input
//                         type="file"
//                         name="image"
//                         onChange={handleImageChange}
//                     />
//                     <button className='btn btn-success' onClick={handleSaveVaccine}>Save</button>
//                     <button className='btn btn-danger' onClick={() => setEditingVaccine(null)}>Cancel</button>
//                 </div>
//             )}
//         </div>
//     );
// };

const Vaccine = () => {
    const { petId } = useParams();
    const location = useLocation();
    const [petName, setPetName] = useState(location.state?.petName || '');
    const [medicalHistory, setMedicalHistory] = useState([]);
    const [editingVaccine, setEditingVaccine] = useState(null);
    const [newVaccineData, setNewVaccineData] = useState({
        name: '',
        date: '',
        image: null
    });

    useEffect(() => {
        fetchMedicalHistory();
    }, [petId]);

    const fetchMedicalHistory = async () => {
        const fakeMedicalHistory = [
            { id: 1, name: 'Rabies', date: '2023-01-15', image: null },
            { id: 2, name: 'Distemper', date: '2023-02-10', image: null }
        ];
        setMedicalHistory(fakeMedicalHistory);
    };

    const handleEditVaccine = (vaccine) => {
        setEditingVaccine(vaccine);
        setNewVaccineData({
            name: vaccine.name,
            date: vaccine.date,
            image: vaccine.image
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewVaccineData({
            ...newVaccineData,
            [name]: value
        });
    };

    const handleImageChange = (e) => {
        setNewVaccineData({
            ...newVaccineData,
            image: e.target.files[0]
        });
    };

    const handleSaveVaccine = async () => {
        if (editingVaccine) {
            const updatedMedicalHistory = medicalHistory.map((vaccine) =>
                vaccine.id === editingVaccine.id
                    ? { ...vaccine, name: newVaccineData.name, date: newVaccineData.date, image: newVaccineData.image }
                    : vaccine
            );
            setMedicalHistory(updatedMedicalHistory);
            setEditingVaccine(null);
            toast.success('Vaccine information updated successfully');
        } else {
            const newVaccine = {
                id: medicalHistory.length + 1,
                name: newVaccineData.name,
                date: newVaccineData.date,
                image: newVaccineData.image
            };
            setMedicalHistory([...medicalHistory, newVaccine]);
            toast.success('New vaccine added successfully');
        }
        setNewVaccineData({ name: '', date: '', image: null });
    };

    const handleDeleteVaccine = async (vaccineId) => {
        const updatedMedicalHistory = medicalHistory.filter(vaccine => vaccine.id !== vaccineId);
        setMedicalHistory(updatedMedicalHistory);
        toast.success('Vaccine deleted successfully');
    };

    return (
        <div className="medical-history-container">
            <h2>Vaccine for {petName}</h2>
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>Vaccine Name</th>
                        <th>Vaccine Date</th>
                        <th>Image</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {medicalHistory.map((vaccine, index) => (
                        <tr key={index}>
                            <td>{vaccine.name}</td>
                            <td>{vaccine.date}</td>
                            <td>
                                {vaccine.image && (
                                    <img className="vaccine-image" src={URL.createObjectURL(vaccine.image)} alt="Vaccine" />
                                )}
                            </td>
                            <td>
                                <button className='btn btn-warning' onClick={() => handleEditVaccine(vaccine)}>Edit</button>
                                <button className='btn btn-danger' onClick={() => handleDeleteVaccine(vaccine.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="form-container">
                <h3>{editingVaccine ? 'Edit Vaccine' : 'Add New Vaccine'}</h3>
                <input
                    type="text"
                    name="name"
                    placeholder="Vaccine Name"
                    value={newVaccineData.name}
                    onChange={handleInputChange}
                />
                <input
                    type="date"
                    name="date"
                    placeholder="Vaccine Date"
                    value={newVaccineData.date}
                    onChange={handleInputChange}
                />
                <input
                    type="file"
                    name="image"
                    onChange={handleImageChange}
                />
                <button className='btn btn-success' onClick={handleSaveVaccine}>
                    {editingVaccine ? 'Save' : 'Add Vaccine'}
                </button>
                {editingVaccine && (
                    <button className='btn btn-danger' onClick={() => setEditingVaccine(null)}>Cancel</button>
                )}
            </div>
        </div>
    );
};


export default Vaccine;
