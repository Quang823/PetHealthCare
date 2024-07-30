import { useEffect, useState } from 'react';
import { Modal, Button, Table, Form, Row, Col } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
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
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        const file = e.target.files[0];
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/tiff', 'image/webp', 'image/svg+xml'];

        if (file && validImageTypes.includes(file.type)) {
            setFile(file);
        } else {
            toast.error("Please select a valid image file (jpg, jpeg, png, gif, bmp, tiff, tif, webp, svg).");
            e.target.value = null; // Reset the file input
        }
    };

    const handleSubmit = (isEdit = false) => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        const { petName, petAge, petGender, petType, vaccination, imageUrl } = petForm;
        let messages = {
            petName: validatePetName(petName),
            petAge: validatePetAge(petAge),
            petGender: !petGender ? 'Please select a gender.' : '',
            petType: !petType ? 'Please select a pet type.' : ''
        };

        if (Object.values(messages).some(msg => msg !== '')) {
            setValidationMessages(messages);
            setIsSubmitting(false);
            return;
        }

        const formData = new FormData();
        formData.append('request', JSON.stringify({
            petName,
            petAge,
            petGender,
            petType,
            vaccination
        }));

        if (file) {
            formData.append('file', file);
        } else if (isEdit && !file && imageUrl) {
            formData.append('file', imageUrl);
        }

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
                toast.error(isEdit ? "Can not update pet (This pet has booking details) " : "Failed to add new pet (Pet name is duplicated)");
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const handleDeletePet = (petId) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure you want to delete this pet?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        axios.delete(`http://localhost:8080/pet/deletePet/${petId}`)
                            .then(res => {
                                if (res.data.message === "Pet is existing in booking") {
                                    toast.error("This pet has booking details. Please check your booking history before deleting this pet.");
                                } else {
                                    setData(data.filter(pet => pet.petId !== petId));
                                    toast.success("Delete pet success");
                                }
                            })
                            .catch(err => {
                                console.log(err);
                                toast.error("Failed to delete pet");
                            });
                    }
                },
                {
                    label: 'No',
                    onClick: () => toast.info("Pet deletion canceled")
                }
            ]
        });
    };

    const handleViewVaccine = (petId, petName) => {
        navigate(`/vaccine/${petId}`, { state: { petName } });
    };

    const handleViewMedicalHistory = (petId) => {
        navigate(`/medical-history/${petId}`);
    };

    const handleActionChange = (e, pet) => {
        const action = e.target.value;

        switch (action) {
            case 'edit':
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
                break;
            case 'delete':
                handleDeletePet(pet.petId);
                break;
            case 'viewVaccine':
                handleViewVaccine(pet.petId, pet.petName);
                break;
            case 'viewHistory':
                handleViewMedicalHistory(pet.petId);
                break;
            default:
                break;
        }

        e.target.selectedIndex = 0;
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
            <h4 className="phs-header">List of Pets</h4>
            <Button
                onClick={() => setShowForm(true)}
                className="phs-bbtn phs-bbtn-add"
                variant="primary"
            >
                <FaPlus className="add-icon" /> Add New Pet
            </Button>
            <Table className="phs-styled-table" responsive="md" striped hover>
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
                                {pet.imageUrl && <img src={pet.imageUrl} alt={pet.petName} style={{ width: '130px', height: '130px', objectFit: 'cover' }} />}
                            </td>
                            <td>
                                <Form.Select onChange={(e) => handleActionChange(e, pet)}>
                                    <option value="">Select Action</option>
                                    <option value="edit">Edit</option>
                                    <option value="delete">Delete</option>
                                    <option value="viewVaccine">View Vaccine</option>
                                    <option value="viewHistory">View History</option>
                                </Form.Select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showForm || showEditForm} onHide={() => { setShowForm(false); setShowEditForm(false); resetForm(); }}>
                <Modal.Header closeButton>
                    <Modal.Title>{showEditForm ? 'Edit Pet' : 'Add New Pet'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Row} controlId="formPetName">
                            <Form.Label column sm={3}>Pet Name:</Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type="text"
                                    name="petName"
                                    value={petForm.petName}
                                    onChange={handleChange}
                                    isInvalid={validationMessages.petName}
                                />
                                <Form.Control.Feedback type="invalid">{validationMessages.petName}</Form.Control.Feedback>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formPetAge">
                            <Form.Label column sm={3}>Pet Age:</Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type="number"
                                    name="petAge"
                                    value={petForm.petAge}
                                    onChange={handleChange}
                                    isInvalid={validationMessages.petAge}
                                />
                                <Form.Control.Feedback type="invalid">{validationMessages.petAge}</Form.Control.Feedback>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formPetGender">
                            <Form.Label column sm={3}>Pet Gender:</Form.Label>
                            <Col sm={9}>
                                <Form.Control as="select" name="petGender" value={petForm.petGender} onChange={handleChange}>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </Form.Control>
                                {validationMessages.petGender && <div className="invalid-feedback">{validationMessages.petGender}</div>}
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formPetType">
                            <Form.Label column sm={3}>Pet Type:</Form.Label>
                            <Col sm={9}>
                                <Form.Control as="select" name="petType" value={petForm.petType} onChange={handleChange}>
                                    <option value="">Select Pet Type</option>
                                    <option value="DOG">DOG</option>
                                    <option value="CAT">CAT</option>
                                    <option value="CHICKEN">CHICKEN</option>
                                    <option value="BIRD">BIRD</option>
                                    <option value="HAMSTER">HAMSTER</option>
                                </Form.Control>
                                {validationMessages.petType && <div className="invalid-feedback">{validationMessages.petType}</div>}
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formVaccination">
                            <Form.Label column sm={3}>Vaccination:</Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type="text"
                                    name="vaccination"
                                    value={petForm.vaccination}
                                    onChange={handleChange}
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formFile">
                            <Form.Label column sm={3}>Image:</Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type="file"
                                    name="file"
                                    accept=".jpg,.jpeg,.png,.gif,.bmp,.tiff,.tif,.webp,.svg"
                                    onChange={handleFileChange}
                                />
                                {petForm.imageUrl && !file && (
                                    <div className="mt-2">
                                        <img src={petForm.imageUrl} alt="Current" style={{ maxWidth: '100%', height: 'auto' }} />
                                    </div>
                                )}
                            </Col>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { setShowForm(false); setShowEditForm(false); resetForm(); }}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleSubmit(showEditForm)} disabled={isSubmitting}>
                        {showEditForm ? 'Update' : 'Save Changes'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default TablePet;
