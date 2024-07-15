import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import './ServicePet.scss'
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
         imageUrl: ''
    });
    const formRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [postPerPage,setpostPerPage] =useState(5);
    

    
    

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
        setNewService({
            ...newService,
            [e.target.name]: e.target.value
        });
    };

    const handleAddNew = () => {
        if (!newService.name || !newService.price || !newService.description) {
            toast.error("Please fill in all fields");
            return;
        }
        const serviceData = { ...newService };
        axios.post("http://localhost:8080/Service/create", serviceData)
            .then(res => {
                setService([...service, res.data]);
                setNewService({
                    
                    name: '',
                    price: '',
                    description: '',
                     imageUrl: ''
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
        const { serviceID, ...serviceData } = newService;
        axios.put(`http://localhost:8080/Service/update/${serviceID}`, serviceData)
            .then(res => {
                setService(service.map(s => (s.serviceID === serviceID ? res.data : s)));
                setShowEditForm(false);
                setNewService({
                    
                    name: '',
                    price: '',
                    description: '',
                     imageUrl: ''
                });
                toast.success("Update success");
            })
            .catch(err => {
                toast.error("Failed to update ");
            });
    };

    const handleDelete = (serviceId) => {
        axios.delete(`http://localhost:8080/Service/delete/${serviceId}`)
            .then(() => {
                setService(service.filter(s => s.serviceId !== serviceId));
                toast.success("Delete success");
            })
            .catch(err => {
                toast.error("Failed to delete pet");
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
                    {/* <button className="back-button" onClick={handleBack}>Back</button> */}
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
                                    <button className="delete-button" onClick={() => handleDelete(service.serviceId)}>Delete</button>
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
                    <div className="form-container" ref={formRef}>
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
                            type="text"
                            name="imageUrl"
                            placeholder="Image URL"
                            value={newService.imageUrl}
                            onChange={handleChange}
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
                    <div className="form-container" ref={formRef}>
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
                            type="text"
                            name="imageUrl"
                            placeholder="Image URL"
                            value={newService.imageUrl}
                            onChange={handleChange}
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