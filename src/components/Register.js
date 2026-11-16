import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL, { getError } from '../api';
import { UserContext } from '../App';

function Register() {
    const { login } = useContext(UserContext);
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    function handleSubmit(event) {
        event.preventDefault();

        // POST /api/register/ creates the patient and returns a token
        let data = JSON.stringify({
            "username": username,
            "first_name": firstName,
            "last_name": lastName,
            "email": email,
            "password": password
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: API_URL + 'register/',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                login(response.data.token);
                navigate('/');
            })
            .catch((error) => {
                setError(getError(error));
            });
    }

    return (
        <div className="row justify-content-center">
            <div className="col-md-6">
                <h1>Register</h1>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">First name</label>
                        <input className="form-control" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Last name</label>
                        <input className="form-control" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button className="btn btn-primary">Register</button>
                </form>
                <p className="mt-3">Already registered? <Link to="/login">Login</Link></p>
            </div>
        </div>
    );
}

export default Register;
