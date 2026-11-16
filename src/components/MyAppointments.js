import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URL, { getError } from '../api';
import { UserContext } from '../App';

function MyAppointments() {
    const { token } = useContext(UserContext);
    const [appointments, setAppointments] = useState([]);
    const [message, setMessage] = useState('');
    // Changing "refresh" makes useEffect load the list again
    const [refresh, setRefresh] = useState(0);

    // GET /api/appointments/ - the API only returns this patient's appointments
    useEffect(() => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: API_URL + 'appointments/',
            headers: {
                'Authorization': 'Token ' + token
            }
        };

        axios.request(config)
            .then((response) => {
                setAppointments(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [token, refresh]);

    function cancelAppointment(id) {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) {
            return;
        }

        // DELETE /api/appointments/<id>/
        let config = {
            method: 'delete',
            maxBodyLength: Infinity,
            url: API_URL + 'appointments/' + id + '/',
            headers: {
                'Authorization': 'Token ' + token
            }
        };

        axios.request(config)
            .then(() => {
                setMessage('Your appointment has been cancelled.');
                setRefresh(refresh + 1);
            })
            .catch((error) => {
                setMessage(getError(error));
            });
    }

    return (
        <div>
            <h1>My Appointments</h1>
            {message && <div className="alert alert-info">{message}</div>}
            <table className="table">
                <thead>
                    <tr><th>Doctor</th><th>Date</th><th>Time</th><th>Reason</th><th></th></tr>
                </thead>
                <tbody>
                    {appointments.map((appointment) => (
                        <tr key={appointment.id}>
                            <td>{appointment.slot_detail.doctor_name}</td>
                            <td>{appointment.slot_detail.date}</td>
                            <td>{appointment.slot_detail.start_time.slice(0, 5)}</td>
                            <td>{appointment.reason}</td>
                            <td>
                                <Link to={'/appointments/' + appointment.id + '/edit'} className="btn btn-secondary btn-sm me-1">Edit</Link>
                                <button className="btn btn-danger btn-sm" onClick={() => cancelAppointment(appointment.id)}>Cancel</button>
                            </td>
                        </tr>
                    ))}
                    {appointments.length === 0 && (
                        <tr><td colSpan="5">You have no appointments.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default MyAppointments;
