import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import API_URL from './api';
import NavBar from './components/NavBar';
import Home from './components/Home';
import DoctorDetail from './components/DoctorDetail';
import Login from './components/Login';
import Register from './components/Register';
import BookAppointment from './components/BookAppointment';
import BookingConfirmed from './components/BookingConfirmed';
import MyAppointments from './components/MyAppointments';
import EditAppointment from './components/EditAppointment';
import Dashboard from './components/admin/Dashboard';
import AdminDoctors from './components/admin/AdminDoctors';
import AdminSlots from './components/admin/AdminSlots';
import AdminAppointments from './components/admin/AdminAppointments';
import AdminPatients from './components/admin/AdminPatients';

// Context: shares the token and the logged-in user with every component
export const UserContext = React.createContext();

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);

    // When we have a token, ask the API who is logged in (GET /api/me/)
    useEffect(() => {
        if (token) {
            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: API_URL + 'me/',
                headers: {
                    'Authorization': 'Token ' + token
                }
            };

            axios.request(config)
                .then((response) => {
                    setUser(response.data);
                })
                .catch((error) => {
                    console.log(error);
                    localStorage.removeItem('token');
                    setToken(null);
                });
        } else {
            setUser(null);
        }
    }, [token]);

    function login(newToken) {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    }

    function logout() {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    }

    const isPatient = user && !user.is_staff;
    const isStaff = user && user.is_staff;

    return (
        <UserContext.Provider value={{ token: token, user: user, login: login, logout: logout }}>
            <NavBar />
            <div className="container mt-4 mb-5">
                {token && !user ? (
                    <p>Loading...</p>
                ) : (
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/doctors/:id" element={<DoctorDetail />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Patient pages - login required */}
                        <Route path="/book" element={isPatient ? <BookAppointment /> : <Navigate to="/login" />} />
                        <Route path="/booked" element={isPatient ? <BookingConfirmed /> : <Navigate to="/login" />} />
                        <Route path="/my-appointments" element={isPatient ? <MyAppointments /> : <Navigate to="/login" />} />
                        <Route path="/appointments/:id/edit" element={user ? <EditAppointment /> : <Navigate to="/login" />} />

                        {/* Administrator dashboard - staff only */}
                        <Route path="/dashboard" element={isStaff ? <Dashboard /> : <Navigate to="/login" />} />
                        <Route path="/dashboard/doctors" element={isStaff ? <AdminDoctors /> : <Navigate to="/login" />} />
                        <Route path="/dashboard/slots" element={isStaff ? <AdminSlots /> : <Navigate to="/login" />} />
                        <Route path="/dashboard/appointments" element={isStaff ? <AdminAppointments /> : <Navigate to="/login" />} />
                        <Route path="/dashboard/patients" element={isStaff ? <AdminPatients /> : <Navigate to="/login" />} />
                    </Routes>
                )}
            </div>
        </UserContext.Provider>
    );
}

export default App;
