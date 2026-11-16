import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function BookingConfirmed() {
    // Receive the appointment sent from the booking page
    const location = useLocation();
    const appointment = location.state ? location.state.appointment : null;

    if (!appointment) {
        return <Link to="/my-appointments">Go to My Appointments</Link>;
    }

    const slot = appointment.slot_detail;
    return (
        <div>
            <div className="alert alert-success">
                <h2>Your appointment is confirmed!</h2>
                <p>
                    Doctor: {slot.doctor_name}<br />
                    Date: {slot.date}<br />
                    Time: {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}<br />
                    Reason: {appointment.reason}
                </p>
            </div>
            <Link to="/my-appointments" className="btn btn-primary">My Appointments</Link>
        </div>
    );
}

export default BookingConfirmed;
