import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Modal, Button } from 'react-bootstrap';
import './ServicePet.scss';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import { confirmAlert } from 'react-confirm-alert'; // Import the library
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import the CSS

const ServicePet = () => {
    const [showForm, setShowForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [serviceData, setServiceData] = useState({
        serviceId: '',
        name: '',
        price: '',
        description: '',
        imageUrl: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [postPerPage, setPostPerPage] = useState(5);
    const [file, setFile] = useState(null);
    const [validationMessages, setValidationMessages] = useState({});
    const [serviceToDelete, setServiceToDelete] = useState(null);

    useEffect(() => {
        fetchServices();
    }, [showEditForm, showForm]);

    const fetchServices = async () => {
        try {
            const res = await axios.get("http://localhost:8080/Service/getAllActive");
            setServices(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const validateField = (name, value) => {
        let message = '';
        if (name === 'name') {
            const nameRegex = /^[a-zA-Z\s]+$/;
            if (!value || value.length < 2) {
                message = 'Service name must be at least 2 characters long.';
            } else if (!nameRegex.test(value)) {
                message = 'Service name must contain only letters and spaces.';
            }
        }
        if (name === 'price') {
            const priceValue = parseFloat(value);
            if (isNaN(priceValue) || priceValue < 50000 || priceValue > 10000000) {
                message = 'Price must be between 50,000 and 10,000,000.';
            }
        }
        return message;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setServiceData({
            ...serviceData,
            [name]: value
        });
        setValidationMessages({
            ...validationMessages,
            [name]: validateField(name, value)
        });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
        } else {
            toast.error("Please select a valid image file (jpg, jpeg, png, gif, bmp, tiff, tif, webp, svg)");
        }
    };

    const handleAddNew = async () => {
        const { name, price, description } = serviceData;
        let messages = {
            name: validateField('name', name),
            price: validateField('price', price),
            description: !description ? 'Description is required.' : ''
        };

        if (Object.values(messages).some(msg => msg !== '')) {
            setValidationMessages(messages);
            return;
        }

        const requestJson = JSON.stringify({
            name: name,
            price: price,
            description: description
        });

        const formData = new FormData();
        formData.append('request', requestJson);
        if (file) formData.append('file', file);

        try {
            const res = await axios.post("http://localhost:8080/Service/create", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setServices([...services, res.data.data]);
            resetForm(); // Reset the form after successful addition
            toast.success("Add success");
            setShowForm(false); // Close the form after adding a new service
        } catch (error) {
            toast.error("Failed to add service");
        }
    };

    const handleEditService = (service) => {
        setServiceData({
            ...service,
            imageUrl: service.imageUrl || ''
        });
        setShowEditForm(true);
        setShowForm(true);
    };

    const handleEdit = async () => {
        const { serviceId, name, price, description } = serviceData;
        let messages = {
            name: validateField('name', name),
            price: validateField('price', price),
            description: !description ? 'Description is required.' : ''
        };

        if (Object.values(messages).some(msg => msg !== '')) {
            setValidationMessages(messages);
            return;
        }

        const requestJson = JSON.stringify({
            name: name,
            price: price,
            description: description
        });

        const formData = new FormData();
        formData.append('request', requestJson);
        if (file) formData.append('file', file);

        try {
            const res = await axios.put(`http://localhost:8080/Service/update/${serviceId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setServices(services.map(s => s.serviceId === serviceId ? res.data.data : s));
            resetForm();
            toast.success("Update success");
            setShowEditForm(false);
            setShowForm(false);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                toast.error("This service has a booking. Cannot be edited");
            } else {
                toast.error("This service has a booking. Cannot be edited");
            }
        }
    };

    const handleDelete = async (service) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure you want to delete this service?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            const res = await axios.delete(`http://localhost:8080/Service/delete/${service.serviceId}`);
                            if (res.data.status === 'failed') {
                                toast.error("This service has a booking. Cannot be deleted");
                            } else {
                                setServices(services.filter(s => s.serviceId !== service.serviceId));
                                toast.success("Delete success");
                            }
                        } catch (error) {
                            toast.error("This service has a booking. Cannot be deleted");
                        }
                    }
                },
                {
                    label: 'No'
                }
            ]
        });
    };

    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const currentPosts = services.slice(indexOfFirstPost, indexOfLastPost);

    const resetForm = () => {
        setServiceData({
            serviceId: '',
            name: '',
            price: '',
            description: '',
            imageUrl: ''
        });
        setFile(null);
        setValidationMessages({});
    };

    return (
        <div className="servicepet-container">
            <div className='servicepet-header'>
                <h2 className="servicepet-title">Service List</h2>
                <button className='servicepet-add-button' onClick={() => {
                    setShowForm(true);
                    setShowEditForm(false);
                }}>Add new Service</button>
            </div>

            <table className="servicepet-table table table-striped">
                <thead>
                    <tr>
                        <th>Service ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Description</th>
                        <th>Image</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentPosts.map((service, index) => (
                        <tr key={index}>
                            <td>{service.serviceId}</td>
                            <td>{service.name}</td>
                            <td>{service.price}</td>
                            <td>{service.description}</td>
                            <td>
                                {service.imageUrl && (
                                    <img src={service.imageUrl} alt={service.name} className="servicepet-image" />
                                )}
                            </td>
                            <td>
                                <button className="servicepet-edit-button" onClick={() => handleEditService(service)}>Edit</button>
                                <button className="servicepet-delete-button" onClick={() => handleDelete(service)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <ReactPaginate
                previousLabel={'Previous'}
                nextLabel={'Next'}
                pageCount={Math.ceil(services.length / postPerPage)}
                onPageChange={({ selected }) => setCurrentPage(selected + 1)}
                containerClassName={'servicepet-pagination'}
                activeClassName={'servicepet-active'}
            />

            <Modal show={showForm} onHide={() => setShowForm(false)}>
                <Modal.Header closeButton onClick={() => { resetForm(); }}>
                    <Modal.Title style={{
                        textAlign: 'center', color: '#333',
                        fontFamily: 'Arial, sans-serif',
                        fontWeight: 'bolder',
                        fontSize: '1.5rem'
                    }}>{showEditForm ? 'Edit Service' : 'Add a new Service'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input type="text" name="name" placeholder="Name" value={serviceData.name} onChange={handleChange} />
                    {validationMessages.name && <span className="servicepet-error-message">{validationMessages.name}</span>}
                    <input type="number" name="price" placeholder="Price" value={serviceData.price} onChange={handleChange} />
                    {validationMessages.price && <span className="servicepet-error-message">{validationMessages.price}</span>}
                    <input type="text" name="description" placeholder="Description" value={serviceData.description} onChange={handleChange} />
                    {validationMessages.description && <span className="servicepet-error-message">{validationMessages.description}</span>}
                    <input type="file" name="file" accept=".jpg,.jpeg,.png,.gif,.bmp,.tiff,.tif,.webp,.svg" onChange={handleFileChange} />
                    {serviceData.imageUrl && !file && <img src={serviceData.imageUrl} alt="Service" className="servicepet-preview-image" />}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setShowForm(false);
                        setShowEditForm(false);
                        resetForm();
                    }}>Cancel</Button>
                    <Button variant="primary" onClick={showEditForm ? handleEdit : handleAddNew}>{showEditForm ? 'Update' : 'Add'}</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ServicePet;