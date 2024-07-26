import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './UserATest.scss';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import { toast } from 'react-toastify';
import SideBar from '../SideBar/SideBar';

function UserATest() {
    const [users, setUsers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [newRole, setNewRole] = useState('');
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [postPerPage, setPostPerPage] = useState(5);
    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const currentPosts = users.slice(indexOfFirstPost, indexOfLastPost);

    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        role: ''
    });

    useEffect(() => {
        fetch('http://localhost:8080/account/getAll')
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    const handleBack = () => {
        navigate('/admin');
    };

    const handleAddNew = () => {
        // Add functionality for adding a new user
    };

    const handleEdit = (user) => {
        setCurrentUser(user);
        setNewRole(user.role);
        setShowEditForm(true);
        setShowForm(false);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:8080/account/manageRole/${currentUser.userId}`, { role: newRole })
            .then(response => {
                toast.success('Role updated successfully');
                setUsers(users.map(user => user.userId === currentUser.userId ? { ...user, role: newRole } : user));
                setShowEditForm(false);
                setCurrentUser(null);
            })
            .catch(error => {
                toast.error('Error updating role');
                console.error('Error updating role:', error);
            });
    };

    const handleDelete = (userId) => {
        const userToDelete = users.find(user => user.userId === userId);
        if (userToDelete.role === 'Admin') {
            toast.error('Cannot delete admin user');
            return;
        }
        axios.delete(`http://localhost:8080/account/delete/${userId}`)
            .then(() => {
                setUsers(users.filter(user => user.userId !== userId));
                toast.success("Delete success");
            })
            .catch(err => {
                console.log(err);
                toast.error("Failed to delete");
            });
    };

    const handleChange = (e) => {
        setNewUser({
            ...newUser,
            [e.target.name]: e.target.value
        });
    };

    return (
        <>
            <div className="container">
                <div className='hehe'>
                    <h2 className="my-4">Customer List</h2>
                    {/* <button className="back-button" onClick={handleBack}>Back</button> */}
                </div>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPosts.map((user, index) => (
                            <tr key={index}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>{user.address}</td>
                                <td>{user.role}</td>
                                <td>
                                    {/* <button className="edit-button" onClick={() => handleEdit(user)}>Edit</button> */}
                                    <button className="delete-button" onClick={() => handleDelete(user.userId)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <ReactPaginate
                    previousLabel={'Previous'}
                    nextLabel={'Next'}
                    pageCount={Math.ceil(users.length / postPerPage)}
                    onPageChange={({ selected }) => setCurrentPage(selected + 1)}
                    containerClassName={'pagination'}
                    activeClassName={'active'}
                />

                {showEditForm && (
                    <div className="edit-form">
                        <h3>Edit Role for {currentUser.name}</h3>
                        <form onSubmit={handleEditSubmit}>
                            <label>
                                Role:
                                <input
                                    type="text"
                                    value={newRole}
                                    onChange={(e) => setNewRole(e.target.value)}
                                />
                            </label>
                            <button type="submit">Save</button>
                            <button type="button" onClick={() => setShowEditForm(false)}>Cancel</button>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
}

export default UserATest;
