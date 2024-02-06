import axios from 'axios';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Register.css';

export default function Login() {

    const navigate: NavigateFunction = useNavigate();
    const { login } = useAuth();

    //Setting user as an object
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    })

    //Keeps track of any form changes
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setLoginData(prevFormData => {
            return {
                ...prevFormData,
                [e.target.name]: e.target.value
            }
        })
    }

    interface ValidationErrors {
        [key: string]: string;
    }
    //Setting errors as an object
    const [errors, setErrors] = useState<ValidationErrors>({})

    const validation = (values: typeof loginData) => {
        const error: ValidationErrors = {}
        let errorCount: number = 0
        const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

        if(!values.email) {
            error.email = "Email is required";
            errorCount++;
        }else if(!emailRegex.test(values.email)){
            error.email = "Email must be in a correct format e.g. john@test.com";
            errorCount++;
        }

        if(!values.password) {
            error.password = "Password is required"
            errorCount++;
        }

        return {error, errorCount}
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const temp: { error: ValidationErrors; errorCount: number } = validation(loginData);
        setErrors(temp.error)

        if(temp.errorCount === 0) {
            axios.post('http://localhost:8081/login', loginData )
            .then(res => {
                console.log(res.data);
                if(res.data.success) {
                    login();
                    localStorage.setItem('jwtToken', res.data.token);
                    navigate("/profile")
                }else {
                    alert("No Such User Exist");
                }
            })
            .catch(err => console.error("Login error:", err));
        } 
    }

    return (
        <div className='app__register'>
            <div className='app__register-box p__opensans'>
                <form className='app__register-box_form' onSubmit={handleSubmit} noValidate>
                    <div className='app__register-box-h2'>
                        <h2>Login</h2>
                    </div>
                    <br />
                    <div className='app__register-box_inputs'>
                        <input 
                            type="email" 
                            placeholder='Email' 
                            name='email'
                            value={loginData.email}
                            onChange={handleChange}
                            style={{ marginBottom: errors.email ? '0' : '0.5rem' }}
                        />
                        <small className='app__register-form_error'>{errors.email}</small>
                        <input 
                            type="password" 
                            placeholder='Password' 
                            name='password'
                            value={loginData.password}
                            onChange={handleChange}
                            style={{ marginBottom: errors.password ? '0' : '0.5rem' }}
                        />
                        <small className='app__register-form_error'>{errors.password}</small>
                    </div>
                    <br />
                    <input className='app__register-box_button' type='submit' value='Sign In'/>
                </form> 
            </div>
        </div>
    )
}