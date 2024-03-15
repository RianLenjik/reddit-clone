import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Adjust the import path as needed

export default function ProtectedRoute() {
    const { isLoggedIn, isAuthenticating } = useAuth();

    if(isAuthenticating) {
        return <div>Loading...</div>
    }
    return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}


