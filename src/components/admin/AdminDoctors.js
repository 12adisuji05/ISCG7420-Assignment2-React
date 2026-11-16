import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URL, { getError } from '../../api';
import { UserContext } from '../../App';

function AdminDoctors() {
    const { token } = useContext(UserContext);
    const [doctors, setDoctors] = useState([]);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [specialisation, setSpecialisation] = useState('');
    // null = adding a new doctor, a number = editing that doctor
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [refresh, setRefresh] = useState(0);

    // GET /api/doctors/
    useEffect(() => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: API_URL + 'doctors/',
            headers: {}
        };

        axios.request(config)
            .then((response) => {
                setDoctors(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [refresh]);

    function clearForm() {
        setFirstName('');
        setLastName('');
        setSpecialisation('');
        setEditingId(null);
    }

    function handleSubmit(event) {
        event.preventDefault();

        let data = JSON.stringify({
            "first_name": firstName,
            "last_name": lastName,
            "specialisation": specialisation
        });

        // POST /api/doctors/ to add, PUT /api/doctors/<id>/ to edit
        let config = {
            method: editingId ? 'put' : 'post',
            maxBodyLength: Infinity,
            url: editingId ? API_URL + 'doctors/' + editingId + '/' : API_URL + 'doctors/',
            headers: {
                'Authorization': 'Token ' + token,
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then(() => {
                clearForm();
                setError('');
                setRefresh(refresh + 1);
            })
            .catch((error) => {
                setError(getError(error));
            });
    }

    function editDoctor(doctor) {
        setEditingId(doctor.id);
        setFirstName(doctor.first_name);
        setLastName(doctor.last_name);
        setSpecialisation(doctor.specialisation);
    }

    function deleteDoctor(id) {
        if (!window.confirm('Are you sure you want to delete this doctor?')) {
            return;
        }

        // DELETE /api/doctors/<id>/
        let config = {
            method: 'delete',
            maxBodyLength: Infinity,
            url: API_URL + 'doctors/' + id + '/',
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
            <h1>Doctors</h1>
            {error && <div className="alert alert-danger">{error}</div>}

            <form className="row g-2 mb-4" onSubmit={handleSubmit}>
                <div className="col-md-3">
                    <input className="form-control" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div className="col-md-3">
                    <input className="form-control" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
                <div className="col-md-3">
                    <input className="form-control" placeholder="Specialisation" value={specialisation} onChange={(e) => setSpecialisation(e.target.value)} required />
                </div>
                <div className="col-md-3">
                    <button className="btn btn-primary me-1">{editingId ? 'Save' : 'Add Doctor'}</button>
                    {editingId && <button type="button" className="btn btn-secondary" onClick={clearForm}>Cancel</button>}
                </div>
            </form>

            <table className="table">
                <thead>
                    <tr><th>Name</th><th>Specialisation</th><th></th></tr>
                </thead>
                <tbody>
                    {doctors.map((doctor) => (
                        <tr key={doctor.id}>
                            <td>Dr {doctor.first_name} {doctor.last_name}</td>
                            <td>{doctor.specialisation}</td>
                            <td>
                                <button className="btn btn-secondary btn-sm me-1" onClick={() => editDoctor(doctor)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => deleteDoctor(doctor.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Link to="/dashboard">Back to dashboard</Link>
        </div>
    );
}

export default AdminDoctors;
