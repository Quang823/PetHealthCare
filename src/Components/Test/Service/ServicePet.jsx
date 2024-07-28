import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import './ServicePet.scss';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';

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
    const [isDeleting, setIsDeleting] = useState(false); // New state for deletion
    const [serviceToDelete, setServiceToDelete] = useState(null); // New state for service to delete
    const formRef = useRef(null);

    useEffect(() => {
        fetchServices();
    }, [showEditForm, showForm]);

    useEffect(() => {
        if (showForm || showEditForm) {
            formRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [showForm, showEditForm]);

    const fetchServices = async () => {
        try {
            const res = await axios.get("http://localhost:8080/Service/getAll");
            setServices(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const validateField = (name, value) => {
        let message = '';
        if (name === 'name' && (!value || value.length < 2)) {
            message = 'Service name must be at least 2 characters long.';
        }
        if (name === 'price' && (isNaN(value) || value <= 0)) {
            message = 'Price must be a positive number.';
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
        setFile(e.target.files[0]);
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
            resetForm();
            toast.success("Add success");
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
        setShowForm(false);
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
        } catch (error) {
            toast.error("Failed to update");
        }
    };

    const handleDelete = async (service) => {
        if (service.isBooked) {
            toast.info("This service is currently booked and cannot be deleted.");
            return;
        }

        const confirmDelete = window.confirm("Are you sure you want to delete this service?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:8080/Service/delete/${service.serviceId}`);
            setServices(services.filter(s => s.serviceId !== service.serviceId));
            toast.success("Delete success");
        } catch (error) {
            toast.error("Failed to delete");
        }
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
        <div className="container">
            <div className='hehe'>
                <h2 className="my-4">Service List</h2>
                <button className='bttnn-add' onClick={() => {
                    setShowForm(true);
                    setShowEditForm(false);
                }}>Add new Service</button>
            </div>

            <table className="table table-striped">
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
                                    <img src={service.imageUrl} alt={service.name} style={{ width: '150px', height: '100px' }} />
                                )}
                            </td>
                            <td>
                                <button className="edit-button" onClick={() => handleEditService(service)}>Edit</button>
                                <button className="delete-button" onClick={() => handleDelete(service)}>Delete</button>
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
                containerClassName={'pagination'}
                activeClassName={'active'}
            />

            {(showForm || showEditForm) && (
                <div className="form-container" ref={formRef}>
                    <h3>{showEditForm ? 'Edit Service' : 'Add a new Service'}</h3>
                    <input type="text" name="name" placeholder="Name" value={serviceData.name} onChange={handleChange} />
                    {validationMessages.name && <span className="error-message">{validationMessages.name}</span>}
                    <input type="number" name="price" placeholder="Price" value={serviceData.price} onChange={handleChange} />
                    {validationMessages.price && <span className="error-message">{validationMessages.price}</span>}
                    <input type="text" name="description" placeholder="Description" value={serviceData.description} onChange={handleChange} />
                    {validationMessages.description && <span className="error-message">{validationMessages.description}</span>}
                    <input type="file" onChange={handleFileChange} />
                    {serviceData.imageUrl && !file && <img src={serviceData.imageUrl} alt="Service" style={{ width: '150px', height: '150px' }} />}
                    <button className='btn btn-success' onClick={showEditForm ? handleEdit : handleAddNew}>{showEditForm ? 'Update' : 'Add'}</button>
                    <button className='btn btn-secondary' onClick={() => {
                        setShowForm(false);
                        setShowEditForm(false);
                        resetForm();
                    }}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default ServicePet;
