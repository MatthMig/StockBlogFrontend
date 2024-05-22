import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { GearFill } from 'react-bootstrap-icons';
import { useNavigate } from "react-router-dom";
import { removeTokens } from './auth';

export function ConnectionSettingsButton({ isLoggedIn, username }) {
    const navigate = useNavigate();

    function onLogin() {
        navigate("/login");
    }

    function onSignUp() {
        navigate("/sign-up");
    }

    function onLogOut() {
        removeTokens();
        window.location.reload();
    }

    function onUserSettings() {
        navigate("/user-settings");
    }

    return (
        isLoggedIn ? (
            <div className="log-buttons">
                <span>You&apos;re connected as {username}</span>
                <Button variant="outline-primary" className="ml-2" onClick={onLogOut}>Log Out</Button>
                <GearFill onClick={onUserSettings} className="gear" />
            </div>
        ) : (
            <div className="log-buttons">
                <Button variant="outline-primary" className="ml-2" onClick={onLogin}>Log In</Button>
                <Button variant="primary" className="ml-2" onClick={onSignUp}>Sign Up</Button>
            </div>
        )
    );
}

ConnectionSettingsButton.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    username: PropTypes.string,
};

export default ConnectionSettingsButton;