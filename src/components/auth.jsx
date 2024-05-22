export const setTokens = (data) => {
    if (data.token) {
        localStorage.setItem('token', data.token);
    }
    if (data.name) {
        localStorage.setItem('username', data.name);
    }
    if (data.email) {
        localStorage.setItem('email', data.email);
    }
    if (data.role) {
        localStorage.setItem('role', data.role);
    }
}

export const getTokens = () => {
    return {
        token: localStorage.getItem('token'),
        username: localStorage.getItem('username'),
        email: localStorage.getItem('email'),
        role: localStorage.getItem('role')
    }
}

export const removeTokens = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
}