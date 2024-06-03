import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { fetchAlluser } from '../Service/UserService'
import ReactPaginate from 'react-paginate';
import ModalAddNew from './ModalAddNew';
import ModalEdit from './ModalEdit';
import _ from "lodash";
import './TableUser.scss'
import { CSVLink, CSVDownload } from "react-csv";

const TableUser = (props) => {
    const [listUser, setlistUser] = useState([]);
    const [totalUser, setTotalUser] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [sortBy, setSortBy] = useState("asc");
    const [sortField, setSortField] = useState("id");
    const handleSort = (sortBy, sortField) => {
        setSortBy(sortBy);
        setSortField(sortField)
        let cloneListUser = _.cloneDeep(listUser);
        cloneListUser = _.orderBy(cloneListUser, [sortField], [sortBy]);
        setlistUser(cloneListUser);
    }

    const handlePageClick = (event) => {
        getUser(+event.selected + 1);
    }
    const handleEditUser = (user) => {
        setdatatUserEdit(user);
        setisShowModalEdit(true);
    }
    const [datatUserEdit, setdatatUserEdit] = useState([])
    const [isShowModalEdit, setisShowModalEdit] = useState(false);
    const [isShowModalAddNew, setIsShowModalAddNew] = useState(false);
    const handleClose = () => {
        setIsShowModalAddNew(false)
        setisShowModalEdit(false)
    }

    const handleUpdateTable = (user) => {
        setlistUser([user, ...listUser])
    }
    const handleEditUserFromModal = (user) => {
        let cloneListUser = _.cloneDeep(listUser);
        let index = listUser.findIndex(item => item.id === user.id);
        cloneListUser[index].first_name = user.first_name;
        setlistUser(cloneListUser);
    }
    useEffect(() => {

        getUser(1);
    }, [])

    const getUser = async (page) => {
        let res = await fetchAlluser(page);
        if (res && res.data) {
            setTotalUser(res.total)
            setlistUser(res.data)
            setTotalPage(res.total_pages)
        }
    }
    const csvData = [
        ["firstname", "lastname", "email"],
        ["Ahmed", "Tomi", "ah@smthing.co.com"],
        ["Raed", "Labes", "rl@smthing.co.com"],
        ["Yezzi", "Min l3b", "ymin@cocococo.com"]
    ];
    return (<>
        <div className='my-3 add-new'>
            <span> <b>List user:</b></span>
            <div className='group-btns'>
                <label htmlFor='test' className='btn btn-warning'>
                    <i className="fa-solid fa-file-import">

                    </i>
                    Import
                </label>
                <input type='file' id='test' hidden></input>

                <CSVLink
                    filename={"user.csv"}
                    className="btn btn-primary"
                    target="_blank"

                    data={csvData}>
                    <i className="fa-solid fa-download"></i> Export </CSVLink>


            </div>
            <button className='btn btn-success' onClick={() => setIsShowModalAddNew(true)}> <i class="fa-solid fa-plus"></i>  Add new user</button>
        </div>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th >
                        <div className='sort-header'>
                            <span>ID</span>
                            <span>
                                <i className="fa-solid fa-arrow-up"
                                    onClick={() => handleSort("asc", "id")

                                    }
                                ></i>
                                <i className="fa-solid fa-arrow-down"
                                    onClick={() => handleSort("desc", "id")
                                    }
                                ></i>
                            </span>
                        </div>
                    </th>

                    <th ><span>Email</span>

                    </th>
                    <th>
                        <div className='sort-header'>
                            <span>first name</span>
                            <span>
                                <i className="fa-solid fa-arrow-up"
                                    onClick={() => handleSort("asc", "first_name")

                                    }
                                ></i>
                                <i className="fa-solid fa-arrow-down"
                                    onClick={() => handleSort("desc", "first_name")
                                    }
                                ></i>
                            </span>
                        </div>
                    </th>
                    <th >
                        <span>Last Name </span>

                    </th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {listUser && listUser.length > 0 &&
                    listUser.map((item, index) => {
                        return (
                            <tr key={`users-${index}`}>
                                <td>{item.id}</td>
                                <td>{item.email}</td>
                                <td>{item.first_name}</td>
                                <td>{item.last_name}</td>
                                <td>
                                    <button className='btn btn-warning mx-3'
                                        onClick={() => handleEditUser(item)}
                                    >Edit</button>
                                    <button className='btn btn-danger'>Delete</button>
                                </td>
                            </tr>
                        )
                    }

                    )
                }


            </tbody>
        </Table>
        <ReactPaginate
            breakLabel="..."
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={totalPage}
            previousLabel="< previous"

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
            datatUserEdit={datatUserEdit}
            handleClose={handleClose}
            handleEditUserFromModal={handleEditUserFromModal}
        />
    </>);
}
export default TableUser;