import { ToastContainer, toast } from 'react-toastify';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import { postCreatePet, putUpdatePet } from '../../Service/UserService';

const ModalEdit = (props) => {
    const { show, handleClose, datatPetEdit, handleEditPetFromModal } = props;
    const [name, setName] = useState("");
    const [gender, setGender] = useState("");
    const [type, setType] = useState("");

    const handleEditPet = async () => {
        let res = await putUpdatePet(name, gender, type);
        if (res && res.updatedAt) {
            handleEditPetFromModal({
                firts_name: name,
                id: datatPetEdit.id
            })
            handleClose();
            toast.success("success")
        }
    }
    useEffect(() => {
        if (show) {
            setName(datatPetEdit.name)
        }
    }, [datatPetEdit])
    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Pet</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='body-add-new'>

                        <div className="mb-3">
                            <label className='form-lable'>Name</label>
                            <input type="text" className="form-control"
                                value={name} onChange={(event) => setName(event.target.value)}
                            />

                        </div>
                        <div className="mb-3">
                            <label className='form-lable'>Type</label>
                            <input type="text" className="form-control"
                                value={type} onChange={(event) => setType(event.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label className='form-lable'>Gender</label>
                            <input type="text" className="form-control"
                                value={gender} onChange={(event) => setGender(event.target.value)}
                            />
                        </div>

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleEditPet()}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ModalEdit;