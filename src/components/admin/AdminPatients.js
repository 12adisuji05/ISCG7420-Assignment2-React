import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URL, { getError } from '../../api';
import { UserContext } from '../../App';

function AdminPatients() {
    const { token } = useContext(UserContext);
    const [patients, setPatients] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [error, setError] = useState('');
    const [refresh, setRefresh] = useState(0);

    // GET /api/patients/ - staff only
    useEffect(() => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: API_URL + 'patients/',
            headers: {
                'Authorization': 'Token ' + token
            }
        };

        axios.request(config)
            .then((response) => {
                setPatients(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [token, refresh]);

    function editPatient(patient) {
        setEditingId(patient.id);
        setFirstName(patient.first_name);
        setLastName(patient.last_name);
        setEmail(patient.email);
        setIsActive(patient.is_active);
    }

    function handleSubmit(event) {
        event.preventDefault();

        // PATCH /api/patients/<id>/
        let data = JSON.stringify({
            "first_name": firstName,
            "last_name": lastName,
            "email": email,
            "is_active": isActive
        });

        let config = {
            method: 'patch',
            maxBodyLength: Infinity,
            url: API_URL + 'patients/' + editingId + '/',
            headers: {
                'Authorization': 'Token ' + token,
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then(() => {
                setEditingId(null);
                setError('');
                setRefresh(refresh + 1);
            })
            .catch((error) => {
                setError(getError(error));
            });
    }

    function deletePatient(id) {
        if (!window.confirm('Are you sure you want to delete this patient account?')) {
            return;
        }

        // DELETE /api/patients/<id>/
        let config = {
            method: 'delete',
            maxBodyLength: Infinity,
            url: API_URL + 'patients/' + id + '/',
            headers: {
                'Authorization': 'Token ' + token
            }
        };

        axios.request(config)
            .then(() => {
                setRefresh(refresh + 1);
            })
            .catch((error) => {
                setError(getError(error));
            });
    }

    return (
        <div>
            <h1>Patient Accounts</h1>
            {error && <div className="alert alert-danger">{error}</div>}

            {editingId && (
                <form className="row g-2 mb-4" onSubmit={handleSubmit}>
                    <div className="col-md-3">
                        <input className="form-control" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div className="col-md-3">
                        <input className="form-control" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                    <div className="col-md-3">
                        <input type="email" className="form-control" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="col-md-1 form-check pt-2">
                        <input type="checkbox" id="active" className="form-check-input" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                        <label htmlFor="active" className="form-check-label">Active</label>
                    </div>
                    <div className="col-md-2">
                        <button className="btn btn-primary me-1">Save</button>
                        <button type="button" className="btn btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
                    </div>
                </form>
            )}

            <table className="table">
                <thead>
                    <tr><th>Username</th><th>Name</th><th>Email</th><th>Active</th><th></th></tr>
                </thead>
                <tbody>
                    {patients.map((patient) => (
                        <tr key={patient.id}>
                            <td>{patient.username}</td>
                            <td>{patient.first_name} {patient.last_name}</td>
                            <td>{patient.email}</td>
                            <td>{patient.is_active ? 'Yes' : 'No'}</td>
                            <td>
                                <button className="btn btn-secondary btn-sm me-1" onClick={() => editPatient(patient)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => deletePatient(patient.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    {patients.length === 0 && (
                        <tr><td colSpan="5">No patients yet.</td></tr>
                    )}
                </tbody>
            </table>
            <Link to="/dashboard">Back to dashboard</Link>
        </div>
    );
}

export default AdminPatients;
