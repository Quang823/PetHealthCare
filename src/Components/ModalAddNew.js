import { ToastContainer, toast } from 'react-toastify';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import { postCreateUser } from '../Service/UserService';

const ModalAddNew = (props) => {
  const { show, handleClose, handleUpdateTable } = props;
  const [name, setName] = useState("");
  const [job, setJob] = useState("");
  const handleSaveUser = async () => {
    let res = await postCreateUser(name, job);
    if (res && res.id) {
      handleClose();
      setName('');
      setJob('');
      toast.success("Success")
      handleUpdateTable({ first_name: name, id: res.id })
    } else {
      toast.error("loi");
    }

  }
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add user</Modal.Title>
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
          <Button variant="primary" onClick={() => handleSaveUser()}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ModalAddNew;