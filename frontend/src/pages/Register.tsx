import axios from 'axios';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import './Register.css';

export default function Register() {

    const navigate: NavigateFunction = useNavigate();
    //Setting user as an object
    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        password: ''
    })

    //Keeps track of any form changes
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setRegisterData(prevFormData => {
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

    const validation = (values: typeof registerData) => {
        const error: ValidationErrors = {}
        let errorCount: number = 0
        const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        const passRegex: RegExp = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if(!values.name) {
            error.name = "Name is required";
            errorCount++;
        }

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
        }else if(!passRegex.test(values.password)){
            error.password = "Password must be in the correct format e.g. Pass123!"
            errorCount++; 
        }

        return {error, errorCount}
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const temp: { error: ValidationErrors; errorCount: number } = validation(registerData);
        setErrors(temp.error)

        if(temp.errorCount === 0) {
            axios.post('http://localhost:8081/register', registerData )
            .then(res => console.log(res))
            .catch(err => console.log(err));
            alert("Registration successful")
            navigate("/profile")
        } 
    }

    return (
        <div className='app__register'>
            <div className='app__register-box p__opensans'>
                <form className='app__register-box_form' onSubmit={handleSubmit} noValidate>
                    <div className='app__register-box-h2'>
                        <h2>Register</h2>
                    </div>
                    <br />
                    <div className='app__register-box_inputs'>
                        <input 
                            type="text" 
                            placeholder='Name' 
                            name='name'
                            value={registerData.name}
                            onChange={handleChange}
                            style={{ marginBottom: errors.name ? '0' : '0.5rem' }}
                        />
                        <small className='app__register-form_error'>{errors.name}</small>
                        <input 
                            type="email" 
                            placeholder='Email' 
                            name='email'
                            value={registerData.email}
                            onChange={handleChange}
                            style={{ marginBottom: errors.email ? '0' : '0.5rem' }}
                        />
                        <small className='app__register-form_error'>{errors.email}</small>
                        <input 
                            type="password" 
                            placeholder='Password' 
                            name='password'
                            value={registerData.password}
                            onChange={handleChange}
                            style={{ marginBottom: errors.password ? '0' : '0.5rem' }}
                        />
                        <small className='app__register-form_error'>{errors.password}</small>
                    </div>
                    <div className='app__register-form_password-list'>
                        <p className='p__opensans'>Password must contain: </p>
                        <ul className=' p__opensans'>
                            <li>At least 8 characters</li>
                            <li>At least 1 uppercase letter.</li>
                            <li>At least 1 lowercase letter.</li>
                            <li>At least 1 digit.</li>
                            <li>At least 1 special character e.g. @$!%*?.</li>
                        </ul>
                    </div>
                    <br />
                    <input className='app__register-box_button' type='submit' value='Sign Up'/>
                </form> 
            </div>
        </div>
    )
}