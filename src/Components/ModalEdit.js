import { ToastContainer, toast } from 'react-toastify';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import { postCreateUser, putUpdateUser } from '../Service/UserService';

const ModalEdit = (props) => {
    const { show, handleClose, datatUserEdit, handleEditUserFromModal } = props;
    const [name, setName] = useState("");
    const [job, setJob] = useState("");
    const handleEditUser = async () => {
        let res = await putUpdateUser(name, job);
        if (res && res.updatedAt) {
            handleEditUserFromModal({
                firts_name: name,
                id: datatUserEdit.id
            })
            handleClose();
            toast.success("success")
        }
    }
    useEffect(() => {
        if (show) {
            setName(datatUserEdit.firts_name)
        }
    }, [datatUserEdit])
    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='body-add-new'>

                        <div class="mb-3">
                            <label className='form-lable'>Name</label>
                            <input type="text" className="form-control"
                                value={name} onChange={(event) => setName(event.target.value)}
                            />

                        </div>
                        <div class="mb-3">
                            <label className='form-lable'>Job</label>
                            <input type="text" className="form-control"
                                value={job} onChange={(event) => setJob(event.target.value)}
                            />
                        </div>

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleEditUser()}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ModalEdit;