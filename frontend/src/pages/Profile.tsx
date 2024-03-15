import axios from 'axios';
import { format, parseISO } from 'date-fns';
import React, { useEffect, useState } from 'react';
import bin from "../images/delete.png";
import edit from "../images/pencil.png";
import user from "../images/user.png";
import './Profile.css';

export default function Profile() {
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [dateJoined, setDateJoined] = useState('');

    useEffect(() => {
        // Define the function that fetches the user's profile
        const fetchUserDetails = async () => {
            try {
            const response = await axios.get('http://localhost:8081/profile', {
                headers: {
                // Include the JWT in the Authorization header
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                }
            });
            // If the request is successful, set the user's name
            setUserName(response.data.name);
            setUserEmail(response.data.email);
            setDateJoined(response.data.date);
            } catch (error) {
            console.error('Error fetching user profile:', error);
            // Handle error (e.g., redirect to login, display message)
            }
        };
  
        // Call the fetch function
        fetchUserDetails();
    }, []);

    let formattedDate = '';

    if(dateJoined) {
        const date = parseISO(dateJoined);
        formattedDate = format(date, 'dd/MM/yyyy');
    }
    
    
    return (
        <div className='app__profile'>
            <div className='app__profile-box'>
                <h3 className='app__profile-box_text'>Profile</h3>
                <div className='app__profile-main'>
                    <div className='app__profile-main_general'>
                        <img className='app__profile-main_image' src={user} alt="user-profile" />
                        <div className='app__profile-main_details'>
                            <p className='app__profile-main_name'>{userName}</p>
                            <p className='app__profile-main_email'>{userEmail}</p>
                        </div>
                    </div>

                    <div className='app__profile-icons'>
                        <img className='app__profile-icons_edit' src={edit} alt="edit-icon" />
                        <img className='app__profile-icons_delete' src={bin} alt="delete-icon" />
                    </div>
                </div>
                <p className='app__profile-date_joined'>Joined: {formattedDate}</p>
            </div>
            
        </div>
    )
}