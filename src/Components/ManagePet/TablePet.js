import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from "react-icons/fa";
import './TablePet.scss';

const TablePet = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [userID, setUserID] = useState('');
    const [newPet, setNewPet] = useState({
        petName: '',
        petAge: '',
        petGender: '',
        petType: '',
        vaccination: ''
    });
    const [validationMessages, setValidationMessages] = useState({
        petName: '',
        petAge: '',
        petGender: '',
        petType: '',
        vaccination: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            const userIdFromToken = decodedToken.User.map.userID;
            setUserID(userIdFromToken);
            fetchData(userIdFromToken);
        }
    }, [showForm]);

    const fetchData = async (userId) => {
        try {
            const res = await axios.get(`http://localhost:8080/pet/getAll/${userId}`);
            setData(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const validatePetName = (value) => {
        const re = /^[a-zA-Z\s]+$/;
        return re.test(value) ? '' : 'Pet name should not contain special characters.';
    };

    const validatePetAge = (value) => {
        const re = /^\d+$/;
        return re.test(value) ? '' : 'Pet age should only contain numbers.';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let message = '';

        if (name === 'petName') {
            message = validatePetName(value);
        } else if (name === 'petAge') {
            message = validatePetAge(value);
        }

        setNewPet({
            ...newPet,
            [name]: value
        });

        setValidationMessages({
            ...validationMessages,
            [name]: message
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        let message = '';

        if (name === 'petName') {
            message = validatePetName(value);
        } else if (name === 'petAge') {
            message = validatePetAge(value);
        }

        setNewPet({
            ...newPet,
            [name]: value
        });

        setValidationMessages({
            ...validationMessages,
            [name]: message
        });
    };

    const handleAddPet = () => {
        const { petName, petAge, petGender, petType, vaccination } = newPet;
        let valid = true;
        let messages = {
            petName: validatePetName(petName),
            petAge: validatePetAge(petAge),
            petGender: '',
            petType: '',
            vaccination: ''
        };

        if (!petName || !petAge || !petGender || !petType) {
            valid = false;
            messages.petName = messages.petName || 'Please fill in all required fields.';
        }

        if (!valid) {
            setValidationMessages(messages);
            return;
        }

        axios.post(`http://localhost:8080/pet/create/${userID}`, newPet)
            .then(res => {
                setData([...data, res.data]);
                setShowForm(false);
                setNewPet({
                    petName: '',
                    petAge: '',
                    petGender: '',
                    petType: '',
                    vaccination: ''
                });
                setValidationMessages({
                    petName: '',
                    petAge: '',
                    petGender: '',
                    petType: '',
                    vaccination: ''
                });
                toast.success("Add new pet success");
            })
            .catch(err => {
                console.log(err);
                toast.error("Failed to add new pet (Pet name is duplicated) ");
            });
    };

    const handleUpdatePet = () => {
        const { petId, ...petData } = newPet;
        let messages = {
            petName: validatePetName(petData.petName),
            petAge: validatePetAge(petData.petAge),
            petGender: '',
            petType: '',
            vaccination: ''
        };

        if (!petData.petName || !petData.petAge || !petData.petGender || !petData.petType) {
            messages.petName = messages.petName || 'Please fill in all required fields.';
        }

        if (messages.petName || messages.petAge) {
            setValidationMessages(messages);
            return;
        }

        axios.put(`http://localhost:8080/pet/update/${userID}/${petId}`, petData)
            .then(res => {
                setData(data.map(pet => (pet.petId === petId ? res.data : pet)));
                setShowEditForm(false);
                setNewPet({
                    petName: '',
                    petAge: '',
                    petGender: '',
                    petType: '',
                    vaccination: ''
                });
                setValidationMessages({
                    petName: '',
                    petAge: '',
                    petGender: '',
                    petType: '',
                    vaccination: ''
                });
                toast.success("Update pet success");
            })
            .catch(err => {
                console.log(err);
                toast.error("Failed to update pet");
            });
    };

    const handleDeletePet = (petId) => {
        axios.delete(`http://localhost:8080/pet/deletePet/${userID}/${petId}`)
            .then(() => {
                setData(data.filter(pet => pet.petId !== petId));
                toast.success("Delete pet success");
            })
            .catch(err => {
                console.log(err);
                toast.error("Failed to delete pet");
            });
    };

    const handleViewVaccine = (petId, petName) => {
        navigate(`/vaccine/${petId}`, { state: { petName } });
    };

    const handleViewMedicalHistory = (petId) => {
        navigate(`/medical-history/${petId}`);
    };

    return (
        <div className="table-container">
            <span><h4>List of pets:</h4></span>
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>Pet Name</th>
                        <th>Pet Age</th>
                        <th>Pet Gender</th>
                        <th>Pet Type</th>
                        <th>Vaccination</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((pet, index) => (
                        <tr key={index}>
                            <td>{pet.petName}</td>
                            <td>{pet.petAge}</td>
                            <td>{pet.petGender}</td>
                            <td>{pet.petType}</td>
                            <td>{pet.vaccination}</td>
                            <td>
                                <button className='btnx btn-warning' onClick={() => {
                                    setNewPet(pet);
                                    setShowEditForm(true);
                                    setShowForm(false);
                                }}>Edit</button>
                                <button className='btnx btn-danger' onClick={() => handleDeletePet(pet.petId)}>Delete</button>
                                <button className='btnx btn-view' onClick={() => handleViewVaccine(pet.petId, pet.petName)}> Vaccine</button>
                                <button className='btnx btn-med' onClick={() => handleViewMedicalHistory(pet.petId)}> MedHistory</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className='btnx btn-add' onClick={() => {
                setShowForm(true);
                setShowEditForm(false);
            }}>
                <FaPlus /> Add your new pet
            </button>
            {showForm && (
                <div className="form-container">
                    <h3>Add a new pet</h3>
                    <input
                        type="text"
                        name="petName"
                        placeholder="Pet Name"
                        value={newPet.petName}
                        onChange={handleChange}
                    />
                    {validationMessages.petName && <p className="errorss-messages">{validationMessages.petName}</p>}
                    
                    <input
                        type="text"
                        name="petAge"
                        placeholder="Pet Age"
                        value={newPet.petAge}
                        onChange={handleChange}
                    />
                    {validationMessages.petAge && <p className="errorss-messages">{validationMessages.petAge}</p>}
                    
                    <select
                        name="petGender"
                        value={newPet.petGender}
                        onChange={handleChange}
                    >
                        <option value="">Select Pet Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                    {validationMessages.petGender && <p className="errorss-messages">{validationMessages.petGender}</p>}
                    
                    <select
                        name="petType"
                        value={newPet.petType}
                        onChange={handleChange}
                    >
                        <option value="">Select Pet Type</option>
                        <option value="DOG">DOG</option>
                        <option value="CAT">CAT</option>
                        <option value="CHICKEN">CHICKEN</option>
                        <option value="MOUSE">MOUSE</option>
                        <option value="BIRD">BIRD</option>
                        <option value="HAMSTER">HAMSTER</option>
                    </select>
                    {validationMessages.petType && <p className="errorss-messages">{validationMessages.petType}</p>}
                    
                    <input
                        type="text"
                        name="vaccination"
                        placeholder="Vaccination"
                        value={newPet.vaccination}
                        onChange={handleChange}
                    />
                    {validationMessages.vaccination && <p className="errorss-messages">{validationMessages.vaccination}</p>}
                    
                    <button className='btnx btn-success' onClick={handleAddPet}>
                        Save
                    </button>
                    <button className='btnx btn-danger' onClick={() => setShowForm(false)}>
                        Cancel
                    </button>
                </div>
            )}
            {showEditForm && (
                <div className="form-container">
                <h3>Add a new pet</h3>
                
                <div className="input-group">
                    <input
                        type="text"
                        name="petName"
                        placeholder="Pet Name"
                        value={newPet.petName}
                        onChange={handleChange}
                    />
                    {validationMessages.petName && <p className="errorss-messages">{validationMessages.petName}</p>}
                </div>
            
                <div className="input-group">
                    <input
                        type="text"
                        name="petAge"
                        placeholder="Pet Age"
                        value={newPet.petAge}
                        onChange={handleChange}
                    />
                    {validationMessages.petAge && <p className="errorss-messages">{validationMessages.petAge}</p>}
                </div>
            
                <div className="input-group">
                    <select
                        name="petGender"
                        value={newPet.petGender}
                        onChange={handleChange}
                    >
                        <option value="">Select Pet Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                    {validationMessages.petGender && <p className="errorss-messages">{validationMessages.petGender}</p>}
                </div>
            
                <div className="input-group">
                    <select
                        name="petType"
                        value={newPet.petType}
                        onChange={handleChange}
                    >
                        <option value="">Select Pet Type</option>
                        <option value="DOG">DOG</option>
                        <option value="CAT">CAT</option>
                        <option value="CHICKEN">CHICKEN</option>
                        <option value="MOUSE">MOUSE</option>
                        <option value="BIRD">BIRD</option>
                        <option value="HAMSTER">HAMSTER</option>
                    </select>
                    {validationMessages.petType && <p className="error-message">{validationMessages.petType}</p>}
                </div>
            
                <div className="input-group">
                    <input
                        type="text"
                        name="vaccination"
                        placeholder="Vaccination"
                        value={newPet.vaccination}
                        onChange={handleChange}
                    />
                    {validationMessages.vaccination && <p className="error-message">{validationMessages.vaccination}</p>}
                </div>
            
                <button className='btnx btn-success' onClick={handleAddPet}>
                    Save
                </button>
                <button className='btnx btn-danger' onClick={() => setShowForm(false)}>
                    Cancel
                </button>
            </div>
            
            )}
        </div>
    );
};

export default TablePet;