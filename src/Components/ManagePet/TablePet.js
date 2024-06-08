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

const TablePet = (props) => {
    const [listPet, setlistPet] = useState([]);
    const [totalPet, setTotalPet] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [sortBy, setSortBy] = useState("asc");
    const [sortField, setSortField] = useState("id");
    const [datatPetEdit, setdatatPetEdit] = useState([]);
    const [isShowModalEdit, setisShowModalEdit] = useState(false);
    const [isShowModalAddNew, setIsShowModalAddNew] = useState(false);

    const handleSort = (sortBy, sortField) => {
        setSortBy(sortBy);
        setSortField(sortField);
        let cloneListPet = _.cloneDeep(listPet);
        cloneListPet = _.orderBy(cloneListPet, [sortField], [sortBy]);
        setlistPet(cloneListPet);
    }

    const handlePageClick = (event) => {
        getPet(+event.selected + 1);
    }

    const handleEditPet = (pet) => {
        setdatatPetEdit(pet);
        setisShowModalEdit(true);
    }

    const handleClose = () => {
        setIsShowModalAddNew(false);
        setisShowModalEdit(false);
    }

    const handleUpdateTable = (pet) => {
        setlistPet([pet, ...listPet]);
    }

    const handleEditPetFromModal = (pet) => {
        let cloneListPet = _.cloneDeep(listPet);
        let index = listPet.findIndex(item => item.id === pet.id);
        if (index !== -1) {
            cloneListPet[index] = pet;
            setlistPet(cloneListPet);
        }
    }

    useEffect(() => {
        getPet(1);
    }, []);

    const getPet = async (page) => {
        let res = await fetchAllpet(page);
        if (res && res.data) {
            setTotalPet(res.total);
            setlistPet(res.data);
            setTotalPage(res.total_pages);
        }
    }

    const csvData = [
        ["name", "gender", "type"],
        ["Thinh", "Male", "Dog"],
        ["An", "Female", "Cat"],
        ["Hao", "Male", "Dog"]
    ];

    return (
        <>
            <div className='my-3 add-new'>
                <span><b>List of pets:</b></span>
                <div className='group-btns'>
                    <label htmlFor='test' className='btn btn-warning'>
                        <MdInput />
                        Import
                    </label>
                    <input type='file' id='test' hidden></input>

                    <CSVLink
                        filename={"pet.csv"}
                        className="btn btn-primary"
                        target="_blank"
                        data={csvData}>
                        <MdOutput /> Export
                    </CSVLink>
                </div>
                <button className='btn btn-success' onClick={() => setIsShowModalAddNew(true)}>
                    <FaPlus /> Add your new pet
                </button>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>
                            <div className='sort-header'>
                                <span>ID</span>
                                <span>
                                    <FaArrowUp onClick={() => handleSort("asc", "id")} />
                                    <FaArrowDown onClick={() => handleSort("desc", "id")} />
                                </span>
                            </div>
                        </th>
                        <th><span>Type</span></th>
                        <th>
                            <div className='sort-header'>
                                <span>Name</span>
                                <span>
                                    <FaArrowUp onClick={() => handleSort("asc", "name")} />
                                    <FaArrowDown onClick={() => handleSort("desc", "name")} />
                                </span>
                            </div>
                        </th>
                        <th><span>Gender</span></th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {listPet && listPet.length > 0 &&
                        listPet.map((item, index) => {
                            return (
                                <tr key={`pets-${index}`}>
                                    <td>{item.id}</td>
                                    <td>{item.type}</td>
                                    <td>{item.name}</td>
                                    <td>{item.gender}</td>
                                    <td>
                                        <button className='btn btn-warning' onClick={() => handleEditPet(item)}>Edit</button>
                                        <button className='btn btn-danger'>Delete</button>
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </Table>
            <ReactPaginate
                breakLabel="..."
                nextLabel="tiếp >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={totalPage}
                previousLabel="< trước"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName='page-link'
                nextClassName='page-item'
                nextLinkClassName='page-link'
                breakClassName='page-item'
                breakLinkClassName='page-link'
                containerClassName='pagination'
                activeClassName='active'
            />
            <ModalAddNew
                show={isShowModalAddNew}
                handleClose={handleClose}
                handleUpdateTable={handleUpdateTable}
            />
            <ModalEdit
                show={isShowModalEdit}
                datatPetEdit={datatPetEdit}
                handleClose={handleClose}
                handleEditPetFromModal={handleEditPetFromModal}
            />
        </>
    );
}

export default TablePet;
