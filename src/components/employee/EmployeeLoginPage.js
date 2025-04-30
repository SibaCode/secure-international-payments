import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/EmployeeLoginPage.css';
import { useAuth } from '../../../src/AuthContext';

function EmployeeLoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');
  const { user, logout , role } = useAuth();

  const { setUser } = useAuth();
  const { login } = useAuth(); // Get login from context
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://localhost:7150/api/employee/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.employee, 'employee');
navigate('/employee-dashboard');
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', formData.username);
        setError('');
        navigate('/employee-dashboard');
      } else if (response.status === 400) {
        const errorData = await response.json();
        const errors = Object.values(errorData).flat().join(' ');
        setError(errors);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while logging in.');
    }
  };

  return (
    <div className="login-container">
      <h2>Employee Login</h2>
      <div>
      <h2>Welcome, {user.fullName}</h2>
      <p>Account Number: {user.accountNumber}</p>
      {/* <button onClick={logout}>Logout</button> */}
      <button onClick={() => {
  logout();
  navigate('/');
}}>
  Logout
</button>
    </div>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="login-btn">Login</button>
        {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
      </form>
    </div>
  );
}

export default EmployeeLoginPage;
