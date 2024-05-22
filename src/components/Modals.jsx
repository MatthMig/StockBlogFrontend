import PropTypes from 'prop-types';
import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { deleteUser } from './api';

const WarningModal = ({ text, show, handleClose }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Warning</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {text}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

WarningModal.propTypes = {
    text: PropTypes.string.isRequired,
    show: PropTypes.bool,
    handleClose: PropTypes.func.isRequired,
};

const UserDetailsModal = ({ user, show, handleClose, currentUser }) => {
    if (!user) {
        return null;
    }

    const handleDelete = async (email) => {
        try {
            await deleteUser(email);
            handleClose();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>User Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                    <>
                        {user.role === 'admin' && (
                            <p style={{ color: 'red' }}><strong>Admin</strong></p>
                        )}
                        <p><strong>Username:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        {currentUser && currentUser.role === 'admin' && user.role !== 'admin' && (
                            <Button variant="danger" onClick={() => handleDelete(user.email)}>
                                Delete User
                            </Button>
                        )}
                    </>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

UserDetailsModal.propTypes = {
    user: PropTypes.object,
    show: PropTypes.bool,
    handleClose: PropTypes.func.isRequired,
    currentUser: PropTypes.object,
};

const ConfirmPasswordModal = ({ show, handleClose, handleConfirm, errorMessage }) => {
    const [password, setPassword] = useState('');

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmClick = () => {
        handleConfirm(password);
        setPassword('');
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <Form.Group controlId="formPassword">
                    <Form.Label>Current Password:</Form.Label>
                    <Form.Control type="password" value={password} onChange={handlePasswordChange} />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleConfirmClick}>
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

ConfirmPasswordModal.propTypes = {
    show: PropTypes.bool,
    handleClose: PropTypes.func.isRequired,
    handleConfirm: PropTypes.func.isRequired,
    errorMessage: PropTypes.string,
};

export { ConfirmPasswordModal, UserDetailsModal, WarningModal };

