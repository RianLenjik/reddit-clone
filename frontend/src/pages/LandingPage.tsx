import React from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {

    const navigate: NavigateFunction = useNavigate();

    return (
        <div className='app__landing_page'>
            <div className='app__landing_page-box p__opensans'>
                <div className='app__landing_page-box-h2'>
                    <h2>Welcome to Simple Reddit!</h2>
                </div>
                <br />
                <div className='app__landing_page-box-p'>
                    <p>This is an intra-firm social media website to discuss with
                        colleagues and senior level staff regarding questions, queries, issues, 
                        and suggestions about the projects undertaken, innovation in the related 
                        IT fields and general topics. If you are interested to join then 
                        click the button bellow.
                    </p>
                </div>
                <br />
                <button className='app__landing_page-box_button' type='submit' onClick={() => {navigate('/register')}}>
                    SIGN UP
                </button>
            </div>
        </div>
    )
}