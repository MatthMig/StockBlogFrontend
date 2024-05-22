import { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { WarningModal } from '../components/Modals';
import { postAuthLogin, postAuthSignup } from '../components/api';
import { setTokens } from '../components/auth';

function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const handleSignUp = async (event) => {
        event.preventDefault();

        const data = await postAuthSignup(email, password, name);

        if (data.status) {
            // Connect the user directly if signup is successfull
            const dataLogin = await postAuthLogin(email, password);   
            dataLogin.email = email;         
            setTokens(dataLogin);
            window.location.href = '/'
        } else if (data.error == 'Weak password!') {
            setModalMessage('Weak password! Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.');
            setShowModal(true);
        } else if (data.error == 'A user with this email already exists.') {
            setModalMessage('A user with this email already exists.');
            setShowModal(true);
        } else if (data.error == 'Validation error: Validation is on name failed') {
            setModalMessage('Username must contain only letters and not be empty.');
            setShowModal(true);
        } else {
            console.error('Error creating user:', data);
        }
    };

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} md={6}>
                    <h4>Sign Up</h4>
                    <Form onSubmit={handleSignUp}>
                        <Form.Group controlId="formUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder="Enter username" value={name} onChange={(e) => setName(e.target.value)} />
                        </Form.Group>

                        <Form.Group controlId="formEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </Form.Group>

                        <Form.Group controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </Form.Group>
                        <br/>
                        <Button variant="primary" type="submit">
                            Sign Up
                        </Button>
                    </Form>
                    <WarningModal
                        show={showModal}
                        handleClose={() => setShowModal(false)}
                        text={modalMessage}
                    />
                </Col>
            </Row>
        </Container>
    );
}

export default SignUpPage;