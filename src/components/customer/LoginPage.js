import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../src/AuthContext';
import './../customer/css/LoginPage.css'; // Your styling

function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    accountNumber: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const registerData = {
      fullName: formData.fullName,
      idNumber: formData.idNumber,
      accountNumber: formData.accountNumber,
      password: formData.password,
    };
  
    try {
      const response = await fetch('https://localhost:7150/api/Customers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });
  
      if (response.ok) {
        const data = await response.json();
        setError(''); // clear any old errors
        navigate('/login'); // after registration, redirect to login page maybe
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };
  

  return (
    <div className="login-container">
      <h2>Customer Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            
          />
        </div>
        <div className="form-group">
          <label>Account Number</label>
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            
          />
                    {errors.password && <div className="error-message">{errors.password}</div>}

        </div>
        <button type="submit" className="login-btn">Login</button>
        {error && (
    <div style={{ color: 'red', marginTop: '10px' }}>
      {error}
    </div>
  )}
  
      </form>
    </div>
  );
}

export default LoginPage;
