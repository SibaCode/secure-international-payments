import React from 'react';
import { useNavigate } from 'react-router-dom';
import './EmployeeNavbar.css';

const Navbar = ({ employeeName = "Employee" }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h3>{employeeName}'s Dashboard</h3>
      </div>
      <div className="navbar-right">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
