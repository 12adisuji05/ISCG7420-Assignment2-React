import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URL, { getError } from '../../api';
import { UserContext } from '../../App';

function AdminSlots() {
    const { token } = useContext(UserContext);
    const [slots, setSlots] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [doctor, setDoctor] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        // GET /api/slots/
        let slotsConfig = {
            method: 'get',
            maxBodyLength: Infinity,
            url: API_URL + 'slots/',
            headers: {}
        };

        axios.request(slotsConfig)
            .then((response) => {
                setSlots(response.data);
            })
            .catch((error) => {
                console.log(error);
            });

        // GET /api/doctors/ - for the doctor dropdown
        let doctorsConfig = {
            method: 'get',
            maxBodyLength: Infinity,
            url: API_URL + 'doctors/',
            headers: {}
        };

        axios.request(doctorsConfig)
            .then((response) => {
                setDoctors(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [refresh]);

    function clearForm() {
        setDoctor('');
        setDate('');
        setStartTime('');
        setEndTime('');
        setEditingId(null);
    }

    function handleSubmit(event) {
        event.preventDefault();

        let data = JSON.stringify({
            "doctor": doctor,
            "date": date,
            "start_time": startTime,
            "end_time": endTime
        });

        // POST /api/slots/ to add, PUT /api/slots/<id>/ to edit
        let config = {
            method: editingId ? 'put' : 'post',
            maxBodyLength: Infinity,
            url: editingId ? API_URL + 'slots/' + editingId + '/' : API_URL + 'slots/',
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

    function editSlot(slot) {
        setEditingId(slot.id);
        setDoctor(slot.doctor);
        setDate(slot.date);
        setStartTime(slot.start_time.slice(0, 5));
        setEndTime(slot.end_time.slice(0, 5));
    }

    function deleteSlot(id) {
        if (!window.confirm('Are you sure you want to delete this slot?')) {
            return;
        }

        // DELETE /api/slots/<id>/
        let config = {
            method: 'delete',
            maxBodyLength: Infinity,
            url: API_URL + 'slots/' + id + '/',
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
            <h1>Appointment Slots</h1>
            {error && <div className="alert alert-danger">{error}</div>}

            <form className="row g-2 mb-4" onSubmit={handleSubmit}>
                <div className="col-md-3">
                    <select className="form-select" value={doctor} onChange={(e) => setDoctor(e.target.value)} required>
                        <option value="">Choose a doctor</option>
                        {doctors.map((d) => (
                            <option key={d.id} value={d.id}>Dr {d.first_name} {d.last_name}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-3">
                    <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div className="col-md-2">
                    <input type="time" className="form-control" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                </div>
                <div className="col-md-2">
                    <input type="time" className="form-control" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
                </div>
                <div className="col-md-2">
                    <button className="btn btn-primary me-1">{editingId ? 'Save' : 'Add Slot'}</button>
                    {editingId && <button type="button" className="btn btn-secondary" onClick={clearForm}>Cancel</button>}
                </div>
            </form>

            <table className="table">
                <thead>
                    <tr><th>Doctor</th><th>Date</th><th>Time</th><th>Status</th><th></th></tr>
                </thead>
                <tbody>
                    {slots.map((slot) => (
                        <tr key={slot.id}>
                            <td>{slot.doctor_name}</td>
                            <td>{slot.date}</td>
                            <td>{slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}</td>
                            <td>{slot.is_booked ? 'Booked' : 'Available'}</td>
                            <td>
                                <button className="btn btn-secondary btn-sm me-1" onClick={() => editSlot(slot)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => deleteSlot(slot.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Link to="/dashboard">Back to dashboard</Link>
        </div>
    );
}

export default AdminSlots;
