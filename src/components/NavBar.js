import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../App';

function NavBar() {
    const { user, logout } = useContext(UserContext);
    const navigate = useNavigate();

    function logoutClicked() {
        logout();
        navigate('/');
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container">
                <Link className="navbar-brand" to="/">Piki Ora Medical Centre</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item"><Link className="nav-link" to="/">Doctors</Link></li>
                        {user && user.is_staff && (
                            <li className="nav-item"><Link className="nav-link" to="/dashboard">Admin Dashboard</Link></li>
                        )}
                        {user && !user.is_staff && (
                            <>
                                <li className="nav-item"><Link className="nav-link" to="/book">Book Appointment</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/my-appointments">My Appointments</Link></li>
                            </>
                        )}
                    </ul>
                    <ul className="navbar-nav">
                        {user ? (
                            <>
                                <li className="nav-item"><span className="nav-link">Hello, {user.username}</span></li>
                                <li className="nav-item">
                                    <button className="btn btn-link nav-link" onClick={logoutClicked}>Logout</button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
