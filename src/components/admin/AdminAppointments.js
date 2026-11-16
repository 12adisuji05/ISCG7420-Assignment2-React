import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URL, { getError } from '../../api';
import { UserContext } from '../../App';

function AdminAppointments() {
    const { token } = useContext(UserContext);
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState('');
    const [refresh, setRefresh] = useState(0);

    // GET /api/appointments/ - staff get every appointment
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
                setRefresh(refresh + 1);
            })
            .catch((error) => {
                setError(getError(error));
            });
    }

    return (
        <div>
            <h1>All Appointments</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <table className="table">
                <thead>
                    <tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Reason</th><th></th></tr>
                </thead>
                <tbody>
                    {appointments.map((appointment) => (
                        <tr key={appointment.id}>
                            <td>{appointment.patient}</td>
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
                        <tr><td colSpan="6">No appointments yet.</td></tr>
                    )}
                </tbody>
            </table>
            <Link to="/dashboard">Back to dashboard</Link>
        </div>
    );
}

export default AdminAppointments;
