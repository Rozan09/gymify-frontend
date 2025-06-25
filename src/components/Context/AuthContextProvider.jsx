import React, { createContext, useEffect, useState } from 'react'
import Loader from '../Loader/Loader'

// Export the context
export const AuthContext = createContext(null)

// Export the provider component
export const AuthContextProvider = ({children}) => {
    const [token, setToken] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const tokenFromStorage = localStorage.getItem("token");
        if (tokenFromStorage) {
            setToken(tokenFromStorage);
        }
        setIsLoading(false);
    }, [])

    const login = (newToken) => {
        if (!newToken) return;
        localStorage.setItem("token", newToken);
        setToken(newToken);
    }

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        localStorage.removeItem("userRole");
        setToken(null);
    }

    if (isLoading) {
        return (
            <Loader/>
        );
    }

    return (
        <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
}

// Create and export a custom hook for using the context
export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthContextProvider');
    }
    return context;
}
