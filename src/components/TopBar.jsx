import PropTypes from 'prop-types';
import { Nav, Navbar } from 'react-bootstrap';
import '../css/top_bar.css';
import ConnectionSettingsButton from './ConnectionSettingsButton';

const TopBar = ({ isLoggedIn, username, role }) => {
    return (
        <Navbar bg="light" variant="light" className={`navbar custom-navbar fixed-top`}>
            <Navbar.Brand href="#home" className="navbar-brand">StockBlog</Navbar.Brand>
                <Nav className="ml-auto right-align">
                    {role === 'admin' && <span className="admin-indicator">Admin</span>}
                    <ConnectionSettingsButton
                        isLoggedIn={isLoggedIn}
                        username={username}
                    />
                </Nav>
        </Navbar>
    );
};

TopBar.propTypes = {
    isLoggedIn: PropTypes.bool,
    username: PropTypes.string,
    role: PropTypes.string,
};

export default TopBar;
