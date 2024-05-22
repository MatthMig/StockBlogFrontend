import { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { WarningModal } from '../components/Modals';
import { postAuthLogin } from '../components/api';
import { setTokens } from '../components/auth';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalText, setModalText] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();
    
        const data = await postAuthLogin(email, password);
    
        if (data && data.token) {
            data.email = email
            setTokens(data);
            window.location.href = '/'; // Redirect to the home page
        } else if (data && data.message === 'Wrong email/password') {
            setModalText('Wrong email/password');
            setShowModal(true);
        } else {
            console.error('Error logging in:', data);
        }
    };

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} md={6}>
                    <h4>Login</h4>
                    <Form onSubmit={handleLogin}>
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
                            Login
                        </Button>
                    </Form>
                    <WarningModal 
                        show={showModal} 
                        handleClose={() => setShowModal(false)} 
                        text={modalText}
                    />
                </Col>
            </Row>
        </Container>
    );
}

export default LoginPage;