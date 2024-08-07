import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './UserATest.scss';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';

function UserATest() {
    const [users, setUsers] = useState([]);
    const [showEditForm, setShowEditForm] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [newRole, setNewRole] = useState('');
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [postPerPage, setPostPerPage] = useState(5);
    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const currentPosts = users.slice(indexOfFirstPost, indexOfLastPost);

    useEffect(() => {
        fetch('http://localhost:8080/account/getAll')
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    const handleBack = () => {
        navigate('/admin');
    };

    const handleEdit = (user) => {
        setCurrentUser(user);
        setNewRole(user.role);
        setShowEditForm(true);
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

    const handleDelete = (user) => {
        if (user.isLocked) {
            // Unlock the user
            axios.get(`http://localhost:8080/account/cancelDeleteUser/${user.userId}`)
                .then(response => {
                    if (response.data.status === "ok" || response.data.message === "User deleted successfully") {
                        setUsers(users.map(u => u.userId === user.userId ? { ...u, isLocked: false } : u));
                        toast.success("User unlocked successfully");
                    } else {
                        toast.error("Can not unlock user");
                    }
                })
                .catch(err => {
                    console.error(err);
                    toast.error("Failed to unlock user");
                });
        } else {
            // Lock the user
            axios.delete(`http://localhost:8080/account/delete/${user.userId}`)
                .then(response => {
                    if (response.data.status === "ok" || response.data.message === "User deleted successfully") {
                        setUsers(users.map(u => u.userId === user.userId ? { ...u, isLocked: true } : u));
                        toast.success("User locked successfully");
                    } else if (response.data.status === "failed" && response.data.message === "User not found or booked") {
                        toast.error("User is having booking, can not lock user");
                    }
                })
                .catch(err => {
                    console.error(err);
                    toast.error("Failed to lock user");
                });
        }
    };


    return (
        <div className="useratest-container">
            <div className='useratest-header'>
                <h2 className="my-4">User Account List</h2>
            </div>
            <table className="useratest-table table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
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
                            <td>{user.isLocked ? 'Locked' : 'Active'}</td>
                            <td>
                                {user.role !== 'Admin' && (
                                    <>
                                        <button className="useratest-edit-button" onClick={() => handleEdit(user)}>Edit</button>
                                        <button
                                            className="useratest-delete-button"
                                            onClick={() => handleDelete(user)}>
                                            {user.isLocked ? 'Unlock' : 'Lock'}
                                        </button>
                                    </>
                                )}
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
                containerClassName={'useratest-pagination'}
                activeClassName={'useratest-active'}
            />

            {showEditForm && (
                <Modal show={showEditForm} onHide={() => setShowEditForm(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{
                            textAlign: 'center', color: '#333',
                            fontFamily: 'Arial, sans-serif',
                            fontWeight: 'bolder',
                            fontSize: '1.5rem'
                        }}>Edit Role for {currentUser.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={handleEditSubmit}>
                            <label style={{ width: '100%' }}>
                                Role:
                                <select
                                    value={newRole}
                                    onChange={(e) => setNewRole(e.target.value)}
                                >
                                    <option value="Customer">Customer</option>
                                    <option value="Veterinarian">Veterinarian</option>
                                    <option value="Staff">Staff</option>
                                </select>
                            </label>
                            <Button type="submit">Save</Button>
                            <Button variant="secondary" onClick={() => setShowEditForm(false)}>Cancel</Button>
                        </form>
                    </Modal.Body>
                </Modal>
            )}
        </div>
    );
}

export default UserATest;
