import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../api';

function Home() {
    const [doctors, setDoctors] = useState([]);

    // Load the doctors when the page opens (GET /api/doctors/)
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
    }, []);

    return (
        <div>
            <h1>Our Doctors</h1>
            <p>Choose a doctor to see their available appointment times.</p>
            <div className="row">
                {doctors.map((doctor) => (
                    <div className="col-md-4 mb-3" key={doctor.id}>
                        <div className="card h-100">
                            <div className="card-body">
                                <h5 className="card-title">Dr {doctor.first_name} {doctor.last_name}</h5>
                                <p className="card-text">{doctor.specialisation}</p>
                                <Link to={'/doctors/' + doctor.id} className="btn btn-primary">View times</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {doctors.length === 0 && <p>No doctors yet.</p>}
        </div>
    );
}

export default Home;
