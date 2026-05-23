import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    const BASE_URL = 'http://127.0.0.1:5555/api';

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            
            fetch(`${BASE_URL}/auth/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                if (!res.ok) throw new Error('Token validation failed');
                return res.json();
            })
            .then(data => setUser(data))
            .catch(() => logout())
            .finally(() => setLoading(false));
        } else {
            localStorage.removeItem('token');
            setUser(null);
            setLoading(false);
        }
    }, [token]);

    const login = async (username, password) => {
        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Authentication failed');

        setToken(data.token);
        setUser(data.user);
        return data;
    };

    const signup = async (username, password) => {
        const res = await fetch(`${BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');

        setToken(data.token);
        return data;
    };

    const logout = async () => {
    if (token) {
        try {
            await fetch(`${BASE_URL}/auth/logout`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (err) {
            console.error("Backend logout failed", err);
        }
    }
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, signup, logout, loading, BASE_URL }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);