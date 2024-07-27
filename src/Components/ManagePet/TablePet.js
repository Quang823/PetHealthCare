import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'; // Import Modal
import Form from 'react-bootstrap/Form'; // Import Form
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode'; // Fix import
import { useNavigate } from 'react-router-dom';
import { FaPlus } from "react-icons/fa";
import './TablePet.scss';

const TablePet = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [userID, setUserID] = useState('');
    const [petForm, setPetForm] = useState({
        petId: '',
        petName: '',
        petAge: '',
        petGender: '',
        petType: '',
        vaccination: '',
        imageUrl: ''
    });
    const [file, setFile] = useState(null);
    const [validationMessages, setValidationMessages] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            const userIdFromToken = decodedToken.User.map.userID;
            setUserID(userIdFromToken);
            fetchData(userIdFromToken);
        }
    }, [showEditForm, showForm]);

    const fetchData = async (userId) => {
        try {
            const res = await axios.get(`http://localhost:8080/pet/getPet/${userId}`);
            setData(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const validatePetName = (value) => {
        const re = /^[a-zA-Z\s]+$/;
        if (value.length < 2 || value.length > 10) {
            return 'Pet name must be between 2 and 10 characters.';
        } else if (!re.test(value)) {
            return 'Pet name should not contain special characters or numbers.';
        }
        return '';
    };

    const validatePetAge = (value) => {
        const re = /^\d+$/;
        const age = parseInt(value);
        if (!re.test(value)) {
            return 'Pet age should only contain numbers.';
        } else if (age < 1 || age > 50) {
            return 'Pet age must be between 1 and 50.';
        }
        return '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPetForm({
            ...petForm,
            [name]: value
        });

        setValidationMessages({
            ...validationMessages,
            [name]: name === 'petName' ? validatePetName(value) : name === 'petAge' ? validatePetAge(value) : ''
        });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = (isEdit = false) => {
        const { petName, petAge, petGender, petType, vaccination } = petForm;
        let messages = {
            petName: validatePetName(petName),
            petAge: validatePetAge(petAge),
            petGender: !petGender ? 'Please select a gender.' : '',
            petType: !petType ? 'Please select a pet type.' : ''
        };

        if (Object.values(messages).some(msg => msg !== '')) {
            setValidationMessages(messages);
            return;
        }

        const formData = new FormData();
        const requestJson = JSON.stringify({
            petName,
            petAge,
            petGender,
            petType,
            vaccination
        });

        formData.append('request', requestJson);
        if (file) formData.append('file', file);

        const request = isEdit
            ? axios.put(`http://localhost:8080/pet/update/${petForm.petId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            : axios.post(`http://localhost:8080/pet/create/${userID}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

        request
            .then(res => {
                setData(isEdit ? data.map(pet => (pet.petId === petForm.petId ? res.data : pet)) : [...data, res.data]);
                setShowForm(false);
                setShowEditForm(false);
                resetForm();
                toast.success(isEdit ? "Update pet success" : "Add new pet success");
            })
            .catch(err => {
                console.log(err);
                toast.error(isEdit ? "Failed to update pet" : "Failed to add new pet (Pet name is duplicated)");
            });
    };

    const handleDeletePet = (petId) => {
        axios.get(`http://localhost:8080/bookingDetail/getBookingDetailByPetIsDeleted/${petId}`)
            .then(res => {
                if (res.data.length > 0) {
                    if (window.confirm('This pet has booking details. Please check your booking history before deleting this pet. Do you want to cancel them before deleting the pet?')) {
                        axios.post('http://localhost:8080/bookingDetail/cancelBookingDetailByPet', { petId })
                            .then(() => {
                                deletePet(petId);
                            })
                            .catch(err => {
                                console.log(err);
                                toast.error("Failed to cancel booking details");
                            });
                    }
                } else {
                    if (window.confirm('Are you sure you want to delete this pet?')) {
                        deletePet(petId);
                    }
                }
            })
            .catch(err => {
                console.log(err);
                toast.error("Failed to fetch booking details");
            });
    };

    const deletePet = (petId) => {
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

    const resetForm = () => {
        setPetForm({
            petId: '',
            petName: '',
            petAge: '',
            petGender: '',
            petType: '',
            vaccination: '',
            imageUrl: ''
        });
        setFile(null);
        setValidationMessages({});
    };

    return (
        <div className="phs-table-container">
            <h4 className="phs-header">List of pets:</h4>
            <Button onClick={() => setShowForm(true)} className="phs-bbtn phs-bbtn-add">
                <FaPlus className="add-icon" /> Add New Pet
            </Button>
            <Table className="phs-styled-table">
                <thead>
                    <tr>
                        <th>Pet Name</th>
                        <th>Pet Age</th>
                        <th>Pet Gender</th>
                        <th>Pet Type</th>
                        <th>Vaccination</th>
                        <th>Image</th>
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
                                {pet.imageUrl && <img src={pet.imageUrl} alt={pet.petName} style={{ width: '100px', height: '100px' }} />}
                            </td>
                            <td className="actions-cell">
                                <div className="actions-container">
                                    <Button
                                        className="phs-bbtn phs-bbtn-warning"
                                        onClick={() => {
                                            setShowEditForm(true);
                                            setPetForm({
                                                petId: pet.petId,
                                                petName: pet.petName,
                                                petAge: pet.petAge,
                                                petGender: pet.petGender,
                                                petType: pet.petType,
                                                vaccination: pet.vaccination,
                                                imageUrl: pet.imageUrl
                                            });
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        className="phs-bbtn phs-bbtn-danger"
                                        onClick={() => handleDeletePet(pet.petId)}
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        className="phs-bbtn phs-bbtn-view"
                                        onClick={() => handleViewVaccine(pet.petId, pet.petName)}
                                    >
                                        Vaccine
                                    </Button>
                                    <Button
                                        className="phs-bbtn phs-bbtn-med"
                                        onClick={() => handleViewMedicalHistory(pet.petId)}
                                    >
                                        MedHistory
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal for Add/Edit Pet Form */}
            <Modal show={showForm || showEditForm} onHide={() => { setShowForm(false); setShowEditForm(false); resetForm(); }}>
                <Modal.Header closeButton>
                    <Modal.Title>{showEditForm ? 'Edit Pet' : 'Add New Pet'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Pet Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="petName"
                                value={petForm.petName}
                                onChange={handleChange}
                                placeholder="Pet Name"
                                isInvalid={!!validationMessages.petName}
                            />
                            <Form.Control.Feedback type="invalid">
                                {validationMessages.petName}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Pet Age</Form.Label>
                            <Form.Control
                                type="text"
                                name="petAge"
                                value={petForm.petAge}
                                onChange={handleChange}
                                placeholder="Pet Age"
                                isInvalid={!!validationMessages.petAge}
                            />
                            <Form.Control.Feedback type="invalid">
                                {validationMessages.petAge}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Pet Gender</Form.Label>
                            <Form.Control as="select" name="petGender" value={petForm.petGender} onChange={handleChange}>
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Pet Type</Form.Label>
                            <Form.Control as="select" name="petType" value={petForm.petType} onChange={handleChange}>
                                <option value="">Select Pet Type</option>
                                <option value="DOG">DOG</option>
                                <option value="CAT">CAT</option>
                                <option value="BIRD">BIRD</option>
                                <option value="FISH">FISH</option>
                                <option value="RABBIT">RABBIT</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Vaccination</Form.Label>
                            <Form.Control
                                type="text"
                                name="vaccination"
                                value={petForm.vaccination}
                                onChange={handleChange}
                                placeholder="Vaccination"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Image</Form.Label>
                            <Form.Control type="file" onChange={handleFileChange} />
                        </Form.Group>
                        <Button type="button" onClick={() => handleSubmit(showEditForm)} className="phs-bbtn phs-bbtn-success mt-3">
                            Save Pet
                        </Button>
                        <Button
                            type="button"
                            onClick={() => {
                                setShowForm(false);
                                setShowEditForm(false);
                                resetForm();
                            }}
                            className="phs-bbtn phs-bbtn-danger mt-3 ms-2"
                        >
                            Cancel
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default TablePet;
