import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL, { getError } from '../api';
import { UserContext } from '../App';

function BookAppointment() {
    const { token } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [slots, setSlots] = useState([]);
    // The doctor page sends the chosen slot to this page
    const [slot, setSlot] = useState(location.state ? location.state.slot : '');
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');

    // Load all free slots (GET /api/slots/?available=true)
    useEffect(() => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: API_URL + 'slots/?available=true',
            headers: {}
        };

        axios.request(config)
            .then((response) => {
                setSlots(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    function handleSubmit(event) {
        event.preventDefault();

        // POST /api/appointments/ - the token tells the API who is booking
        let data = JSON.stringify({
            "slot": slot,
            "reason": reason
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: API_URL + 'appointments/',
            headers: {
                'Authorization': 'Token ' + token,
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                // Pass the new appointment to the confirmation page
                navigate('/booked', { state: { appointment: response.data } });
            })
            .catch((error) => {
                setError(getError(error));
            });
    }

    return (
        <div className="row justify-content-center">
            <div className="col-md-6">
                <h1>Book Appointment</h1>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Time slot</label>
                        <select className="form-select" value={slot} onChange={(e) => setSlot(e.target.value)} required>
                            <option value="">Choose a time</option>
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
                    <button className="btn btn-primary">Book</button>
                </form>
            </div>
        </div>
    );
}

export default BookAppointment;
