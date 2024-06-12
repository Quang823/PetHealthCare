
import { ToastContainer, toast } from 'react-toastify';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import { postCreatePet } from '../../Service/UserService';

const ModalAddNew = (props) => {
  const { show, handleClose, handleUpdateTable } = props;
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [gender, setGender] = useState("");
  const handleSavePet = async () => {
    let res = await postCreatePet(name, type, gender);
    if (res && res.id) {
      handleClose();
      setName('');
      setType('');
      setGender('');
      toast.success("Success")
      handleUpdateTable({ name: name, id: res.id })
    } else {
      toast.error("Error");
    }

  }
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Pet</Modal.Title>
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
              <label className='form-lable'>Type</label>
              <input type="text" className="form-control"
                value={type} onChange={(event) => setType(event.target.value)}
              />
            </div>
            <div class="mb-3">
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
          <Button variant="primary" onClick={() => handleSavePet()}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ModalAddNew;
