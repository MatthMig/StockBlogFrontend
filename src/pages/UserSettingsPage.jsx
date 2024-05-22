import { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { ConfirmPasswordModal } from '../components/Modals';
import { deleteMessage, deleteUser, fetchUserMessages, postAuthLogin, updateUser } from '../components/api';
import { getTokens, removeTokens, setTokens } from '../components/auth';

const UserSettings = () => {
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmModalErrorMessage, setConfirmModalErrorMessage] = useState('');
    const [postConfirmAction, setPostConfirmAction] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [userMessages, setUserMessages] = useState([]);
    const navigate = useNavigate()

    const fetchMessagesHistory = async () => {
        setIsLoading(true);
        const email = getTokens().email;
        try {
            const messages = (await fetchUserMessages(email)).user_messages;
            setUserMessages(messages);
        } catch (error) {
            console.error('Failed to fetch user messages:', error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        // Check if user is logged in
        const token = getTokens().token;
        if (!token) {
            // Redirect to login page if not
            navigate("/login");
        } else {
            // Fetch current username from local storage
            setNewUsername(getTokens().username);
        }
        fetchMessagesHistory();
    }, [navigate]);

    const handleSaveUsername = async () => {
        if (!newUsername) {
            setErrorMessage('Username cannot be empty.');
            return;
        }
        setShowConfirmModal(true);
        setPostConfirmAction(() => async () => {
            setNewUsername(newUsername);
            setIsLoading(true);
            try {
                await updateUser(getTokens().email, newUsername, null);
            } catch (error) {
                if (error.message === 'Validation error: Validation is on name failed') {
                    setErrorMessage('Invalid username.');                
                } else {
                    setErrorMessage('An error occurred while updating your information.');
                }
                setShowConfirmModal(false);
                return;
            }
            setIsLoading(false);
            setTokens({ name: newUsername });
            navigate('/');
        });
    };

    const handleSavePassword = () => {
        if (!newPassword) {
            setErrorMessage('Password cannot be empty.');
            return;
        }
        setShowConfirmModal(true);
        setPostConfirmAction(() => async () => {
            setNewPassword(newPassword);
            setIsLoading(true);
            try {
                await updateUser(getTokens().email, null, newPassword);
            } catch (error) {
                if (error.message === 'Weak password!') {
                    setErrorMessage('Your password is too weak. Please use a stronger password.');                
                } else {
                    setErrorMessage('An error occurred while updating your information.');
                }
                setShowConfirmModal(false);
                return;
            }
            setIsLoading(false);
            navigate('/');
        });
    };

    const handleUserAccountDeletion = () => {
        setShowConfirmModal(true);
        setPostConfirmAction(() => async () => {
            try {
                deleteUser(getTokens().email);
                removeTokens();
                navigate('/');
            } catch(error) {
                setErrorMessage('An error occurred while deleting your account.');
            }
        });
    };

    const handleConfirm = async (enteredPassword) => {
        const email = getTokens().email;
        try {
            const response = await postAuthLogin(email, enteredPassword);
            if (response.token) {
                try {
                    postConfirmAction && (await postConfirmAction());
                    setPostConfirmAction(null);
                } catch (error) {
                    setIsLoading(false);
                    setShowConfirmModal(false);
                    setErrorMessage('An error occurred while updating your information.');
                }
            } else {
                // The password is incorrect, show an error message
                setConfirmModalErrorMessage('Incorrect password');
            }
            setIsLoading(false);
        } catch (error) {
            // There was an error, show an error message
            setErrorMessage('An error occurred while checking the password.');
        }
    };

    return (
        <div className={isLoading ? 'loading' : ''}>
            <Container>
                <h2>User Settings</h2>
                {errorMessage && <p className="text-danger">{errorMessage}</p>}
                <Form>
                    <Form.Group as={Row} controlId="formUsername">
                        <Form.Label>New Username:</Form.Label>
                        <Col>
                            <Form.Control type="text" value={newUsername} onChange={e => setNewUsername(e.target.value)} />
                        </Col>
                        <Col xs="auto">
                            <Button variant="primary" type="button" onClick={handleSaveUsername}>Save</Button>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPassword">
                        <Form.Label>New Password:</Form.Label>
                        <Col>
                            <Form.Control type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                        </Col>
                        <Col xs="auto">
                            <Button variant="primary" type="button" onClick={handleSavePassword}>Save</Button>
                        </Col>
                    </Form.Group>
                </Form>
                <h3>Your Messages History</h3>
                <div className="border p-2 mb-2">
                    {[...userMessages].reverse().map((message, index) => {
                        const date = new Date(message.createdAt);
                        const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

                        return (
                            <div key={index} className="d-flex justify-content-between align-items-start">
                                <p>
                                    <strong>{message.symbol}:</strong> {message.content}
                                    <br />
                                    <small>Posted on {formattedDate}</small>
                                </p>
                                <Button variant="danger" onClick={() => { deleteMessage(message.id); fetchMessagesHistory(); }}>
                                    Delete
                                </Button>
                            </div>
                        );
                    })}
                </div>
                <Button variant="danger" onClick={handleUserAccountDeletion}>
                    Delete your account
                </Button>
                <ConfirmPasswordModal show={showConfirmModal} handleClose={() => { setShowConfirmModal(false); setConfirmModalErrorMessage(''); }} handleConfirm={handleConfirm} errorMessage={confirmModalErrorMessage} />
            </Container>
        </div>
    );
};

export default UserSettings;