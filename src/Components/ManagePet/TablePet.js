import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { fetchAllpet } from '../../Service/UserService';
import ReactPaginate from 'react-paginate';
import ModalAddNew from './ModalAddNew';
import ModalEdit from './ModalEdit';
import _ from "lodash";
import './TablePet.scss';
import { CSVLink } from "react-csv";
import { MdInput, MdOutput } from "react-icons/md";
import { FaPlus, FaArrowUp, FaArrowDown } from "react-icons/fa";
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';


const TablePet = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [error, setError] = useState('');
    const [userID, setUserID] = useState('');
    const [newPet, setNewPet] = useState({
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

    }, [newPet]); // Empty dependency array means it runs once after the initial render

    const fetchData = async (userId) => {
        try {
            const res = await axios.get(`http://localhost:8080/pet/getAll/${userId}`);
            setData(res.data);
        } catch (error) {
            console.log(error);
        }
    };


    const handleChange = (e) => {
        setNewPet({
            ...newPet,
            [e.target.name]: e.target.value
        });
    };

    const handleEditChange = (e) => {
        setNewPet({
            ...newPet,
            [e.target.name]: e.target.value
        });
    };

    const handleAddPet = () => {
        if (!newPet.petName || !newPet.petAge || !newPet.petGender || !newPet.petType || !newPet.vaccination) {
            setError('Please fill in all fields.');
            toast.error("Please fill in all fields");
            return;
        }

        const petData = { ...newPet };
        axios.post(`http://localhost:8080/pet/create/${userID}`, petData)
            .then(res => {
                setData([...data, res.data]);
                setNewPet({
                    petName: '',
                    petAge: '',
                    petGender: '',
                    petType: '',
                    vaccination: ''
                });
                setShowForm(false);
                setError('');
                toast.success("Add new pet success");
            })
            .catch(err => console.log(err));
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

    const handleEditPet = (pet) => {
        setNewPet(pet);
        setShowEditForm(true);
    };

    const handleUpdatePet = () => {
        const { petId, ...petData } = newPet;

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
                toast.success("Update pet success");
            })
            .catch(err => {
                console.log(err);
                toast.error("Failed to update pet");
            });
    };
    const handleViewVaccine = (petId, petName) => {
        navigate(`/vaccine/${petId}`, { state: { petName } });
    };
    const handleViewMedicalHistory = (petId, petName) => {
        navigate(`/medical-history/${petId}`);
    };


    return (
        <div className="table-container">
            <span><h4>List of pets:</h4></span>
            <table className="styled-table">
                <thead>
                    <tr>
                        {/* <th>Pet Id</th> */}
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
                            {/* <td>{pet.petId}</td> */}
                            <td>{pet.petName}</td>
                            <td>{pet.petAge}</td>
                            <td>{pet.petGender}</td>
                            <td>{pet.petType}</td>
                            <td>{pet.vaccination}</td>
                            <td>
                                <button className='btn btn-warning' onClick={() => {
                                    handleEditPet(pet);
                                    setShowEditForm(true);
                                    setShowForm(false);
                                }} >Edit</button>
                                <button className='btn btn-danger' onClick={() => handleDeletePet(pet.petId)}>Delete</button>
                                <button className='btn btn-view' onClick={() => handleViewVaccine(pet.petId, pet.petName)}> Vaccine</button>
                                <button className='btn btn-med' onClick={() => handleViewMedicalHistory(pet.petId, pet.petName)}> MedHistory</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className='btn btn-success' onClick={() => {
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
                    <input
                        type="text"
                        name="petAge"
                        placeholder="Pet Age"
                        value={newPet.petAge}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="petGender"
                        placeholder="Pet Gender"
                        value={newPet.petGender}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="petType"
                        placeholder="Pet Type"
                        value={newPet.petType}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="vaccination"
                        placeholder="Vaccination"
                        value={newPet.vaccination}
                        onChange={handleChange}
                    />
                    <button className='btn btn-success' onClick={handleAddPet}>
                        Save
                    </button>
                    <button className='btn btn-danger' onClick={() => setShowForm(false)}>
                        Cancel
                    </button>
                </div>
            )}
            {showEditForm && (<div className="form-container">
                <h3>Edit pet</h3>

                <input
                    type="text"
                    name="petName"
                    placeholder="Pet Name"
                    value={newPet.petName}
                    onChange={handleEditChange}
                />
                <input
                    type="text"
                    name="petAge"
                    placeholder="Pet Age"
                    value={newPet.petAge}
                    onChange={handleEditChange}
                />
                <input
                    type="text"
                    name="petGender"
                    placeholder="Pet Gender"
                    value={newPet.petGender}
                    onChange={handleEditChange}
                />
                <input
                    type="text"
                    name="petType"
                    placeholder="Pet Type"
                    value={newPet.petType}
                    onChange={handleEditChange}
                />
                <input
                    type="text"
                    name="vaccination"
                    placeholder="Vaccination"
                    value={newPet.vaccination}
                    onChange={handleEditChange}
                />
                <button className='btn btn-success' onClick={handleUpdatePet}>
                    Update
                </button>
                <button className='btn btn-danger' onClick={() => setShowEditForm(false)}>
                    Cancel
                </button>
            </div>
            )}
        </div>

    );
};

export default TablePet;