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
    const [service, setService] = useState([]);
    const [newService, setNewService] = useState({
        name: '',
        price: '',
        description: '',
        image: null
    });
    const formRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [postPerPage, setPostPerPage] = useState(5);

    useEffect(() => {
        fetchService();
    }, [newService]);

    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const currentPosts = service.slice(indexOfFirstPost, indexOfLastPost);

    useEffect(() => {
        if (showForm || showEditForm) {
            formRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [showForm, showEditForm]);

    const fetchService = async () => {
        try {
            const res = await axios.get("http://localhost:8080/Service/getAll");
            setService(res.data);
        } catch (er) {
            console.log(er);
        }
    };

    const handleBack = () => {
        navigate('/admin');
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setNewService({
                ...newService,
                image: files[0]
            });
        } else {
            setNewService({
                ...newService,
                [name]: value
            });
        }
    };

    const handleAddNew = () => {
        if (!newService.name || !newService.price || !newService.description || !newService.image) {
            toast.error("Please fill in all fields and select an image");
            return;
        }

        const formData = new FormData();
        formData.append('request', JSON.stringify({
            name: newService.name,
            price: newService.price,
            description: newService.description
        }));
        formData.append('file', newService.image);

        axios.post("http://localhost:8080/Service/create", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(res => {
                setService([...service, res.data.data]);
                setNewService({
                    name: '',
                    price: '',
                    description: '',
                    image: null
                });
                setShowForm(false);
                toast.success("Add success");
            })
            .catch(err => console.log(err));
    };

    const handleEditService = (service) => {
        setNewService(service);
        setShowEditForm(true);
        setShowForm(false);
    };

    const handleEdit = () => {
        const formData = new FormData();
        formData.append('request', JSON.stringify({
            name: newService.name,
            price: newService.price,
            description: newService.description
        }));
        if (newService.image) {
            formData.append('file', newService.image);
        }

        axios.put(`http://localhost:8080/Service/update/${newService.serviceID}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(res => {
                setService(service.map(s => (s.serviceID === newService.serviceID ? res.data.data : s)));
                setShowEditForm(false);
                setNewService({
                    name: '',
                    price: '',
                    description: '',
                    image: null
                });
                toast.success("Update success");
            })
            .catch(err => {
                toast.error("Failed to update ");
            });
    };

    const handleDelete = (serviceID) => {
        axios.delete(`http://localhost:8080/Service/delete/${serviceID}`)
            .then(() => {
                setService(service.filter(s => s.serviceID !== serviceID));
                toast.success("Delete success");
            })
            .catch(err => {
                toast.error("Failed to delete service");
            });
    };

    return (
        <>
            <div className="container">
                <div className='hehe'>
                    <h2 className="my-4">Service List</h2>
                    <button className='btn-add' onClick={() => {
                        setShowForm(true);
                        setShowEditForm(false);
                    }}>Add new Service</button>
                    <button className="back-button" onClick={handleBack}>Back</button>
                </div>

                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>serviceID</th>
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
                                    <button className="edit-button"
                                        onClick={() => {
                                            handleEditService(service);
                                        }}
                                    >Edit</button>
                                    <button className="delete-button" onClick={() => handleDelete(service.serviceID)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <ReactPaginate
                    previousLabel={'Previous'}
                    nextLabel={'Next'}
                    pageCount={Math.ceil(service.length / postPerPage)}
                    onPageChange={({ selected }) => setCurrentPage(selected + 1)}
                    containerClassName={'pagination'}
                    activeClassName={'active'}
                />

                {showForm && (
                    <div className="service-form-container" ref={formRef}>
                        <h3>Add a new service</h3>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={newService.name}
                            onChange={handleChange}
                        />
                        <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={newService.price}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="description"
                            placeholder="Description"
                            value={newService.description}
                            onChange={handleChange}
                        />
                        <input
                            type="file"
                            name="image"
                            onChange={handleChange}
                            accept="image/*"
                        />
                        <button className='btn btn-success' onClick={handleAddNew}>
                            Save
                        </button>
                        <button className='btn btn-danger' onClick={() => setShowForm(false)}>
                            Cancel
                        </button>
                    </div>
                )}

                {showEditForm && (
                    <div className="service-form-container" ref={formRef}>
                        <h3>Edit service</h3>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={newService.name}
                            onChange={handleChange}
                        />
                        <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={newService.price}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="description"
                            placeholder="Description"
                            value={newService.description}
                            onChange={handleChange}
                        />
                        <input
                            type="file"
                            name="image"
                            onChange={handleChange}
                            accept="image/*"
                        />
                        <button className='btn btn-success' onClick={handleEdit}>
                            Update
                        </button>
                        <button className='btn btn-danger' onClick={() => setShowEditForm(false)}>
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default ServicePet;
