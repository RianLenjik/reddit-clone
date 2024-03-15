import axios from 'axios';
import React, { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';

// Define a type for the context state
interface AuthContextType {
  isLoggedIn: boolean;
  isAuthenticating: boolean;
  login: () => void;
  logout: () => void;
}

// Create a context with a default undefined value, then assert the type.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook for consuming context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Define a type for the provider props
interface AuthProviderProps {
  children: ReactNode; // Accepts React children
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(true);

    useEffect(() => {
        // function to verify token
        const validateToken = async () => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            try {
                await axios.get('http://localhost:8081/api/verifyToken', {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    },
                });
                // If the request succeeds, the token is valid
                setIsLoggedIn(true);
                setIsAuthenticating(false)
            } catch (error) {
                // If the request fails, the token is invalid or expired
                console.error('Token validation failed', error);
                setIsLoggedIn(false);
                setIsAuthenticating(false)
                localStorage.removeItem('jwtToken');
            }
        }
        };
        
        validateToken();
        }, []);

    const login = () => setIsLoggedIn(true);
    const logout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('jwtToken'); // Clear the token on logout
    };

    // Provide the state and the functions via context
    return (
        <AuthContext.Provider value={{ isLoggedIn, isAuthenticating, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
};
