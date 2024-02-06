import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Profile.css';

export default function Profile() {
    const [userName, setUserName] = useState('');

    useEffect(() => {
        // Define the function that fetches the user's profile
        const fetchUserName = async () => {
            try {
            const response = await axios.get('http://localhost:8081/profile', {
                headers: {
                // Include the JWT in the Authorization header
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                }
            });
            // If the request is successful, set the user's name
            setUserName(response.data.name);
            } catch (error) {
            console.error('Error fetching user profile:', error);
            // Handle error (e.g., redirect to login, display message)
            }
        };
  
        // Call the fetch function
        fetchUserName();
    }, []);
    
    return (
        <>
            {userName ? <h1>Welcome, {userName}!</h1> : <p>Loading profile...</p>}
        </>
    )
}