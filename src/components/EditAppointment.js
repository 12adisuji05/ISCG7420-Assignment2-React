import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import API_URL, { getError } from '../api';
import { UserContext } from '../App';

// Used by patients (My Appointments) and staff (Admin Dashboard)
function EditAppointment() {
    const { id } = useParams();
    const { token, user } = useContext(UserContext);
    const navigate = useNavigate();
    const [slots, setSlots] = useState([]);
    const [slot, setSlot] = useState('');
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // GET /api/appointments/<id>/
        let appointmentConfig = {
            method: 'get',
            maxBodyLength: Infinity,
            url: API_URL + 'appointments/' + id + '/',
            headers: {
                'Authorization': 'Token ' + token
            }
        };

        // GET /api/slots/?available=true
        let slotsConfig = {
            method: 'get',
            maxBodyLength: Infinity,
            url: API_URL + 'slots/?available=true',
            headers: {}
        };

        axios.request(appointmentConfig)
            .then((response) => {
                const appointment = response.data;
                setSlot(appointment.slot);
                setReason(appointment.reason);

                axios.request(slotsConfig)
                    .then((slotsResponse) => {
                        // The free slots plus the slot this appointment already has
                        setSlots([appointment.slot_detail, ...slotsResponse.data]);
                    });
            })
            .catch((error) => {
                console.log(error);
            });
    }, [id, token]);

    function handleSubmit(event) {
        event.preventDefault();

        // PUT /api/appointments/<id>/
        let data = JSON.stringify({
            "slot": slot,
            "reason": reason
        });

        let config = {
            method: 'put',
            maxBodyLength: Infinity,
            url: API_URL + 'appointments/' + id + '/',
            headers: {
                'Authorization': 'Token ' + token,
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then(() => {
                navigate(user.is_staff ? '/dashboard/appointments' : '/my-appointments');
            })
            .catch((error) => {
                setError(getError(error));
            });
    }

    return (
        <div className="row justify-content-center">
            <div className="col-md-6">
                <h1>Edit Appointment</h1>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Time slot</label>
                        <select className="form-select" value={slot} onChange={(e) => setSlot(e.target.value)} required>
                            {slots.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.doctor_name} - {s.date} {s.start_time.slice(0, 5)}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Reason</label>
                        <input className="form-control" value={reason} onChange={(e) => setReason(e.target.value)} required />
                    </div>
                    <button className="btn btn-primary">Save</button>
                </form>
            </div>
        </div>
    );
}

export default EditAppointment;
