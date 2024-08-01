import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import './MedicalHistoryModal.scss';

function MedicalHistoryModal({ show, onHide, medicalHistory }) {
    console.log("medHistory", medicalHistory);
    return (
        <Modal show={show} onHide={onHide} className="med-history-modal">
            <Modal.Header closeButton>
                <Modal.Title>Medical History</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {medicalHistory ? (
                    <div>
                        <p><strong>Veterinary Name:</strong> {medicalHistory.data.veterinaryName}</p>
                        <p><strong>Disease Name:</strong> {medicalHistory.data.diseaseName}</p>
                        <p><strong>Treatment Method:</strong> {medicalHistory.data.treatmentMethod}</p>
                        <p><strong>Note:</strong> {medicalHistory.data.note}</p>
                        <p><strong>Reminders:</strong> {medicalHistory.data.reminders}</p>

                        <p><strong>Date Medical:</strong> {medicalHistory.data.dateMedicalHistory}</p>
                    </div>
                ) : (
                    <p>No medical history available.</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default MedicalHistoryModal;
