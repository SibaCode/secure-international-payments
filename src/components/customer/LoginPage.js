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

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('https://localhost:7150/api/Customers/Login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: formData.fullName,
        accountNumber: formData.accountNumber,
        password: formData.password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Login success:', data);

      localStorage.setItem('token', data.token);
      setUser({
        fullName: data.customer.fullName,
        accountNumber: data.customer.accountNumber,
        id: data.customer.id,
      });

      navigate('/dashboard');
    } else {
      const errorData = await response.json();
      if (errorData.errors) {
        alert(errorData.errors); // Set error state
      } else {
        alert(errorData.message || 'Login failed');
      }
    }
  } catch (err) {
    console.error('Login Error:', err);
    alert('Something went wrong. Please try again.');
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
      </form>
    </div>
  );
}

export default LoginPage;
