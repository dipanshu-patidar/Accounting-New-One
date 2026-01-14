import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(undefined);

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        } else {
            setCurrentUser(null);
        }
    }, []);

    const login = async (email, password) => {
        const user = await authService.login({ email, password });
        setCurrentUser(user);
        return user;
    };

    const register = async (name, email, password, company_id) => {
        const user = await authService.register({ name, email, password, company_id });
        setCurrentUser(user);
        return user;
    };

    const logout = () => {
        authService.logout();
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
