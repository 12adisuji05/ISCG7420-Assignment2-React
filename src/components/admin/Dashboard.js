import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
    return (
        <div>
            <h1>Admin Dashboard</h1>
            <div className="list-group">
                <Link to="/dashboard/doctors" className="list-group-item list-group-item-action">Manage Doctors</Link>
                <Link to="/dashboard/slots" className="list-group-item list-group-item-action">Manage Appointment Slots</Link>
                <Link to="/dashboard/appointments" className="list-group-item list-group-item-action">All Appointments</Link>
                <Link to="/dashboard/patients" className="list-group-item list-group-item-action">Patient Accounts</Link>
            </div>
        </div>
    );
}

export default Dashboard;
