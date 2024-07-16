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
        name: '',
        price: '',
        description: '',
        imageUrl: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [postPerPage, setPostPerPage] = useState(5);
    const formRef = useRef(null);

    // Fetch services on mount
    useEffect(() => {
        fetchServices();
    }, [services]);

    // Scroll to form when it is shown
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

    const handleChange = (e) => {
        setServiceData({
            ...serviceData,
            [e.target.name]: e.target.value
        });
    };

    const handleAddNew = async () => {
        if (!serviceData.name || !serviceData.price || !serviceData.description) {
            toast.error("Please fill in all fields");
            return;
        }
        try {
            const res = await axios.post("http://localhost:8080/Service/create", serviceData);
            setServices([...services, res.data]);
            setServiceData({ name: '', price: '', description: '', imageUrl: '' });
            setShowForm(false);
            toast.success("Add success");
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditService = (service) => {
        setServiceData(service);
        setShowEditForm(true);
        setShowForm(false);
    };

    const handleEdit = async () => {
        try {
            const { serviceId, ...updatedServiceData } = serviceData;
            const res = await axios.put(`http://localhost:8080/Service/update/${serviceId}`, updatedServiceData);
            setServices(services.map(s => s.serviceId === serviceId ? res.data : s));
            setServiceData({ name: '', price: '', description: '', imageUrl: '' });
            setShowEditForm(false);
            toast.success("Update success");
        } catch (error) {
            console.error("Failed to update service", error);
            toast.error("Failed to update");
        }
    };
    
    const handleDelete = async (serviceId) => {
        try {
            await axios.delete(`http://localhost:8080/Service/delete/${serviceId}`);
            setServices(services.filter(s => s.serviceId !== serviceId));
            toast.success("Delete success");
        } catch (error) {
            console.error("Failed to delete service", error);
            toast.error("Failed to delete");
        }
    };

    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const currentPosts = services.slice(indexOfFirstPost, indexOfLastPost);

    return (
        <div className="container">
            <div className='hehe'>
                <h2 className="my-4">Service List</h2>
                <button className='btn-add' onClick={() => {
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
                                <button className="edit-button" onClick={() => handleEditService(service)}>Edit</button>
                                <button className="delete-button" onClick={() => handleDelete(service.serviceId)}>Delete</button>
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

            {showForm && (
                <div className="form-container" ref={formRef}>
                    <h3>Add a new service</h3>
                    <input type="text" name="name" placeholder="Name" value={serviceData.name} onChange={handleChange} />
                    <input type="number" name="price" placeholder="Price" value={serviceData.price} onChange={handleChange} />
                    <input type="text" name="description" placeholder="Description" value={serviceData.description} onChange={handleChange} />
                    <input type="text" name="imageUrl" placeholder="Image URL" value={serviceData.imageUrl} onChange={handleChange} />
                    <button className='btn btn-success' onClick={handleAddNew}>Save</button>
                    <button className='btn btn-danger' onClick={() => setShowForm(false)}>Cancel</button>
                </div>
            )}

            {showEditForm && (
                <div className="form-container" ref={formRef}>
                    <h3>Edit service</h3>
                    <input type="text" name="name" placeholder="Name" value={serviceData.name} onChange={handleChange} />
                    <input type="number" name="price" placeholder="Price" value={serviceData.price} onChange={handleChange} />
                    <input type="text" name="description" placeholder="Description" value={serviceData.description} onChange={handleChange} />
                    <input type="text" name="imageUrl" placeholder="Image URL" value={serviceData.imageUrl} onChange={handleChange} />
                    <button className='btn btn-success' onClick={handleEdit}>Update</button>
                    <button className='btn btn-danger' onClick={() => setShowEditForm(false)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default ServicePet;
