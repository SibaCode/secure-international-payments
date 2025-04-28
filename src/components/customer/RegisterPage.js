import React, { useState } from 'react';
import './../customer/css/RegisterPage.css'; // Your styling
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    accountNumber: '',
    password: '',
    idNumber: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:7150/api/Customers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Registration successful! Please login.');
        navigate('/login');
      } else {
        const error = await response.json();
        alert(error.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration Error:', err);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="register-container">
      <h2>Customer Registration</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Account Number</label>
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>ID Number</label>
          <input
            type="text"
            name="idNumber"
            value={formData.idNumber}
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
        <button type="submit" className="register-btn">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;
