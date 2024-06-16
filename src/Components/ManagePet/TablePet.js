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
        petname: '',
        petage: '',
        petgender: '',
        pettype: '',
        vaccination: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            const userIdFromToken = decodedToken.User.userID;
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
        if (!newPet.petname || !newPet.petage || !newPet.petgender || !newPet.pettype || !newPet.vaccination) {
            setError('Please fill in all fields.');
            toast.error("Please fill in all fields");
            return;
        }

        const petData = { ...newPet };
        axios.post(`http://localhost:8080/pet/create/${userID}`, petData)
            .then(res => {
                setData([...data, res.data]);
                setNewPet({
                    petname: '',
                    petage: '',
                    petgender: '',
                    pettype: '',
                    vaccination: ''
                });
                setShowForm(false);
                setError('');
                toast.success("Add new pet success");
            })
            .catch(err => console.log(err));
    };

    const handleDeletePet = (petid) => {
        axios.delete(`http://localhost:8080/pet/deletePet/${userID}/${petid}`)
            .then(() => {
                setData(data.filter(pet => pet.petid !== petid));
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
        const { petid, ...petData } = newPet;

        axios.put(`http://localhost:8080/pet/update/${userID}/${petid}`, petData)
            .then(res => {
                setData(data.map(pet => (pet.petid === petid ? res.data : pet)));
                setShowEditForm(false);
                setNewPet({

                    petname: '',
                    petage: '',
                    petgender: '',
                    pettype: '',
                    vaccination: ''
                });
                toast.success("Update pet success");
            })
            .catch(err => {
                console.log(err);
                toast.error("Failed to update pet");
            });
    };
    const handleViewVaccine = (petid, petname) => {
        navigate(`/vaccine/${petid}`, { state: { petname } });
    };
    const handleViewMedicalHistory = (petid, petname) => {
        navigate(`/medical-history/${petid}`);
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
                            {/* <td>{pet.petid}</td> */}
                            <td>{pet.petname}</td>
                            <td>{pet.petage}</td>
                            <td>{pet.petgender}</td>
                            <td>{pet.pettype}</td>
                            <td>{pet.vaccination}</td>
                            <td>
                                <button className='btn btn-warning' onClick={() => {
                                    handleEditPet(pet);
                                    setShowEditForm(true);
                                    setShowForm(false);
                                }} >Edit</button>
                                <button className='btn btn-danger' onClick={() => handleDeletePet(pet.petid)}>Delete</button>
                                <button className='btn btn-view' onClick={() => handleViewVaccine(pet.petid, pet.petname)}> Vaccine</button>
                                <button className='btn btn-med' onClick={() => handleViewMedicalHistory(pet.petid, pet.petname)}> MedHistory</button>
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
                        name="petname"
                        placeholder="Pet Name"
                        value={newPet.petname}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="petage"
                        placeholder="Pet Age"
                        value={newPet.petage}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="petgender"
                        placeholder="Pet Gender"
                        value={newPet.petgender}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="pettype"
                        placeholder="Pet Type"
                        value={newPet.pettype}
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
                    name="petname"
                    placeholder="Pet Name"
                    value={newPet.petname}
                    onChange={handleEditChange}
                />
                <input
                    type="text"
                    name="petage"
                    placeholder="Pet Age"
                    value={newPet.petage}
                    onChange={handleEditChange}
                />
                <input
                    type="text"
                    name="petgender"
                    placeholder="Pet Gender"
                    value={newPet.petgender}
                    onChange={handleEditChange}
                />
                <input
                    type="text"
                    name="pettype"
                    placeholder="Pet Type"
                    value={newPet.pettype}
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