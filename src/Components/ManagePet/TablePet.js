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
// const TablePet = (props) => {
//     const [listPet, setlistPet] = useState([]);
//     const [totalPet, setTotalPet] = useState(0);
//     const [totalPage, setTotalPage] = useState(0);
//     const [sortBy, setSortBy] = useState("asc");
//     const [sortField, setSortField] = useState("id");
//     const [datatPetEdit, setdatatPetEdit] = useState([]);
//     const [isShowModalEdit, setisShowModalEdit] = useState(false);
//     const [isShowModalAddNew, setIsShowModalAddNew] = useState(false);

//     const handleSort = (sortBy, sortField) => {
//         setSortBy(sortBy);
//         setSortField(sortField);
//         let cloneListPet = _.cloneDeep(listPet);
//         cloneListPet = _.orderBy(cloneListPet, [sortField], [sortBy]);
//         setlistPet(cloneListPet);
//     }

//     const handlePageClick = (event) => {
//         getPet(+event.selected + 1);
//     }

//     const handleEditPet = (pet) => {
//         setdatatPetEdit(pet);
//         setisShowModalEdit(true);
//     }

//     const handleClose = () => {
//         setIsShowModalAddNew(false);
//         setisShowModalEdit(false);
//     }

//     const handleUpdateTable = (pet) => {
//         setlistPet([pet, ...listPet]);
//     }

//     const handleEditPetFromModal = (pet) => {
//         let cloneListPet = _.cloneDeep(listPet);
//         let index = listPet.findIndex(item => item.id === pet.id);
//         if (index !== -1) {
//             cloneListPet[index] = pet;
//             setlistPet(cloneListPet);
//         }
//     }

//     useEffect(() => {
//         getPet(1);
//     }, []);

//     const getPet = async (page) => {
//         let res = await fetchAllpet(page);
//         if (res && res.data) {
//             setTotalPet(res.total);
//             setlistPet(res.data);
//             setTotalPage(res.total_pages);
//         }
//     }

//     const csvData = [
//         ["name", "gender", "type"],
//         ["Thinh", "Male", "Dog"],
//         ["An", "Female", "Cat"],
//         ["Hao", "Male", "Dog"]
//     ];

//     return (
//         <>
//             <div className='my-3 add-new'>
//                 <span><b>List of pets:</b></span>
//                 <div className='group-btns'>
//                     <label htmlFor='test' className='btn btn-warning'>
//                         <MdInput />
//                         Import
//                     </label>
//                     <input type='file' id='test' hidden></input>

//                     <CSVLink
//                         filename={"pet.csv"}
//                         className="btn btn-primary"
//                         target="_blank"
//                         data={csvData}>
//                         <MdOutput /> Export
//                     </CSVLink>
//                 </div>
//                 <button className='btn btn-success' onClick={() => setIsShowModalAddNew(true)}>
//                     <FaPlus /> Add your new pet
//                 </button>
//             </div>
//             <Table striped bordered hover>
//                 <thead>
//                     <tr>
//                         <th>
//                             <div className='sort-header'>
//                                 <span>ID</span>
//                                 <span>
//                                     <FaArrowUp onClick={() => handleSort("asc", "id")} />
//                                     <FaArrowDown onClick={() => handleSort("desc", "id")} />
//                                 </span>
//                             </div>
//                         </th>
//                         <th><span>Type</span></th>
//                         <th>
//                             <div className='sort-header'>
//                                 <span>Name</span>
//                                 <span>
//                                     <FaArrowUp onClick={() => handleSort("asc", "name")} />
//                                     <FaArrowDown onClick={() => handleSort("desc", "name")} />
//                                 </span>
//                             </div>
//                         </th>
//                         <th><span>Gender</span></th>
//                         <th>Action</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {listPet && listPet.length > 0 &&
//                         listPet.map((item, index) => {
//                             return (
//                                 <tr key={`pets-${index}`}>
//                                     <td>{item.id}</td>
//                                     <td>{item.type}</td>
//                                     <td>{item.name}</td>
//                                     <td>{item.gender}</td>
//                                     <td>
//                                         <button className='btn btn-warning' onClick={() => handleEditPet(item)}>Edit</button>
//                                         <button className='btn btn-danger'>Delete</button>
//                                     </td>
//                                 </tr>
//                             );
//                         })
//                     }
//                 </tbody>
//             </Table>
//             <ReactPaginate
//                 breakLabel="..."
//                 nextLabel="tiếp >"
//                 onPageChange={handlePageClick}
//                 pageRangeDisplayed={5}
//                 pageCount={totalPage}
//                 previousLabel="< trước"
//                 pageClassName="page-item"
//                 pageLinkClassName="page-link"
//                 previousClassName="page-item"
//                 previousLinkClassName='page-link'
//                 nextClassName='page-item'
//                 nextLinkClassName='page-link'
//                 breakClassName='page-item'
//                 breakLinkClassName='page-link'
//                 containerClassName='pagination'
//                 activeClassName='active'
//             />
//             <ModalAddNew
//                 show={isShowModalAddNew}
//                 handleClose={handleClose}
//                 handleUpdateTable={handleUpdateTable}
//             />
//             <ModalEdit
//                 show={isShowModalEdit}
//                 datatPetEdit={datatPetEdit}
//                 handleClose={handleClose}
//                 handleEditPetFromModal={handleEditPetFromModal}
//             />
//         </>
//     );
// }

// export default TablePet;


const TablePet = () => {
    const [data, setData] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [error, setError] = useState('');
    const [userID, setUserID] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [newPet, setNewPet] = useState({
        petname: '',
        petage: '',
        petgender: '',
        pettype: '',
        vaccination: ''
    });
    // const [currentPet, setCurrentPet] = useState({
    //     petid: '',
    //     petname: '',
    //     petage: '',
    //     petgender: '',
    //     pettype: '',
    //     vaccination: ''
    // });
    const [shouldFetchData, setShouldFetchData] = useState(true);


    // useEffect(()=> {
    //     const fetchUserID = () => {
    //         const token = localStorage.getItem('token');
    //         if (token) {
    //             const decodedToken = jwtDecode(token);
    //             setUserID(decodedToken.User.userID);
    //         }
    //     };
    //   fetchUserID();
    // }, []);

    // useEffect(() => {
    //     try {
    //         if(userID){
    //             axios.get(`http://localhost:8080/pet/getAll/${userID}`)
    //         .then(res => setData(res.data))
    //         .catch(err => console.log(err));
    //         setShouldFetchData(true);
    //         const token = localStorage.getItem('token');
    //         if (token) {
    //             const decodedToken = jwtDecode(token);
    //             setUserID(decodedToken.User.userID);
    //         }
    //         }
    //     } catch (error) {
    //         console.error('cant not load data', )
    //     }


    // }, [newPet]);
    useEffect(() => {
        const fetchUserID = () => {
            const token = localStorage.getItem('token');
            if (token) {
                const decodedToken = jwtDecode(token);
                setUserID(decodedToken.User.userID);
            }
        };
        fetchUserID();
    }, []);

    useEffect(() => {
        const fetchPets = async () => {
            try {
                if (userID) {
                    const res = await axios.get(`http://localhost:8080/pet/getAll/${userID}`);
                    setData(res.data);
                }
            } catch (err) {
                console.error('Cannot load data', err);
            }
        };
        fetchPets();
    }, [userID], [newPet], [isEditing]);

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
        axios.post(`http://localhost:8080/pet/create/${userID}`, newPet)
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

    return (
        <div className="table-container">
            <span><b>List of pets:</b></span>
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>Pet Id</th>
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
                            <td>{pet.petid}</td>
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
            {showEditForm && (
                <div className="form-container">
                    <h3>Edit pet</h3>
                    <input
                        type="text"
                        name="petid"
                        placeholder="Pet ID"
                        value={newPet.petid}
                        readOnly
                    />
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