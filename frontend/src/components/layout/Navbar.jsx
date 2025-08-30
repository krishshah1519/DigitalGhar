import React from 'react';
import {FaUserCircle , FaSignOutAlt} from 'react-icons/fa';
import {Link, useNavigate} from 'react-router-dom';

const Navbar = ()=> {
    const navigate= useNavigate();

    const handleLogout = ()=> {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate('/');
        };

    return (
        <header className="bg-gray-800 shadow-md p-4 flex justify-between items-center">
            <Link to="/dashboard">
            <h1 className="text-3xl font-bold text-white">DigitalGhar</h1>
            </Link>
            <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 text-gray-300 hover:text-white">
                    <FaUserCircle />
                    <span>Profile</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 text-gray-300 hover:text-white">
                    <FaSignOutAlt />
                    <span>Logout</span>
                </button>
            </div>
        </header>
    );
};

export default Navbar;

