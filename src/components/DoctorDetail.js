import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../api';
import { UserContext } from '../App';

function DoctorDetail() {
    const { id } = useParams();
    const { user } = useContext(UserContext);
    const [doctor, setDoctor] = useState(null);
    const [slots, setSlots] = useState([]);

    useEffect(() => {
        // GET /api/doctors/<id>/
        let doctorConfig = {
            method: 'get',
            maxBodyLength: Infinity,
            url: API_URL + 'doctors/' + id + '/',
            headers: {}
        };

        axios.request(doctorConfig)
            .then((response) => {
                setDoctor(response.data);
            })
            .catch((error) => {
                console.log(error);
            });

        // GET /api/slots/?available=true&doctor=<id>  (only free times for this doctor)
        let slotsConfig = {
            method: 'get',
            maxBodyLength: Infinity,
            url: API_URL + 'slots/?available=true&doctor=' + id,
            headers: {}
        };

        axios.request(slotsConfig)
            .then((response) => {
                setSlots(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [id]);

    if (!doctor) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Dr {doctor.first_name} {doctor.last_name}</h1>
            <p>{doctor.specialisation}</p>

            <h3>Available times</h3>
            <table className="table">
                <thead>
                    <tr><th>Date</th><th>Time</th><th></th></tr>
                </thead>
                <tbody>
                    {slots.map((slot) => (
                        <tr key={slot.id}>
                            <td>{slot.date}</td>
                            <td>{slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}</td>
                            <td>
                                {user && !user.is_staff ? (
                                    // Pass the chosen slot to the booking page
                                    <Link to="/book" state={{ slot: slot.id }} className="btn btn-primary btn-sm">Book</Link>
                                ) : (
                                    <Link to="/login">Login to book</Link>
                                )}
                            </td>
                        </tr>
                    ))}
                    {slots.length === 0 && (
                        <tr><td colSpan="3">No available times.</td></tr>
                    )}
                </tbody>
            </table>
            <Link to="/">Back</Link>
        </div>
    );
}

export default DoctorDetail;
