import { getTokens } from './auth';

const BASE_BACKEND_URL = `${import.meta.env.VITE_APP_BACKEND_URL}api`;

export async function fetchMessages(asset) {
    const response = await fetch(`${BASE_BACKEND_URL}/messages/${asset.symbol}`);

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    const messages = await response.json();
    return messages;
}

export async function postMessage(asset, message) {
    // Get the token from local storage
    const token = getTokens().token;

    const response = await fetch(`${BASE_BACKEND_URL}/messages/${asset.symbol}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(message),
    });

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(responseData.error || "Network response was not ok");
    }
}

export async function deleteMessage(id) {
    const token = getTokens().token;

    const response = await fetch(`${BASE_BACKEND_URL}/messages/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

    if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.error || "Network response was not ok");
    }
}

export async function deleteUser(userMail) {
    const token = getTokens().token;

    const response = await fetch(`${BASE_BACKEND_URL}/users/${userMail}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

    if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.error || "Network response was not ok");
    }
}

export async function fetchUserDetails(userMail) {
    const encodedUserMail = encodeURIComponent(userMail);
    const response = await fetch(`${BASE_BACKEND_URL}/users/${encodedUserMail}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getTokens().token}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error("Network response was not ok:", errorData);
    }

    const userDetails = (await response.json()).user;
    return userDetails;
}

export async function fetchSymbols() {
    let response;
    try {
        response = await fetch(`${BASE_BACKEND_URL}/alpaca/symbols`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching symbols:', error, response && response.json());
    }
}

export async function fetchBars(asset) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 5);
    const start = startDate.toISOString();

    const endDate = new Date();
    endDate.setMinutes(endDate.getMinutes() - 16);
    const end = endDate.toISOString();

    const timeframe = '1D';

    const response = await fetch(`${BASE_BACKEND_URL}/alpaca/bars/${asset.class}/${asset.symbol}/${start}/${end}/${timeframe}`);
    let data = await response.json();
    if (typeof data.bars === 'object' && data.bars[decodeURIComponent(asset.symbol)]) {
        data.bars = data.bars[decodeURIComponent(asset.symbol)];
    }
    return data;
}

export async function postAuthLogin(email, password) {
    const response = await fetch(`${BASE_BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    return await response.json();
}

export async function postAuthSignup(email, password, name) {
    const response = await fetch(`${BASE_BACKEND_URL}/auth/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
    });
    return await response.json();
}

export async function updateUser(email, name, password) {
    const token = getTokens().token;
    const response = await fetch(`${BASE_BACKEND_URL}/users/${encodeURIComponent(email)}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, password }),
    });

    if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.message);
    }

    return await response.json();
}

export async function fetchUserMessages(userEmail) {
    const token = getTokens().token;
    const encodedUserEmail = encodeURIComponent(userEmail);

    const response = await fetch(`${BASE_BACKEND_URL}/users/${encodedUserEmail}/messages`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error("Network response was not ok:", errorData);
    }

    const userMessages = await response.json();
    return userMessages;
}