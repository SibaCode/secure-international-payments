import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ userType = "Customer" }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const name = localStorage.getItem('username') || userType;

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h3>{name} Dashboard</h3>
      </div>
      <div className="navbar-right">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
