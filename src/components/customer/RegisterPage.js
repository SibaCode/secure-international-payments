import React, { useState } from 'react';
import './../customer/css/RegisterPage.css';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    accountNumber: '',
    password: '',
    idNumber: '',
  });

  const [errors, setErrors] = useState({}); // ✅ you need this!

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: null })); // clear the error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:7150/api/Customers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      // Log raw response text to inspect it
      const responseText = await response.text();
  
      if (response.ok) {
        navigate('/login');
      } else {
        try {
          // Try parsing as JSON if the response is JSON
          const responseBody = JSON.parse(responseText);
          if (responseBody.errors) {
            setErrors(responseBody.errors); // ✅ set errors if validation fails
          } else {
            alert(responseBody.message || 'Registration failed');
          }
        } catch (jsonParseError) {
          // Handle case where the response is not valid JSON
          alert('Registration failed: ' + responseText);
        }
      }
    } catch (err) {
      console.error('Error occurred:', err);
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
            
          />
          {errors.FullName && <div className="error-message">{errors.FullName[0]}</div>}
        </div>

        <div className="form-group">
          <label>Account Number</label>
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            
          />
          {errors.AccountNumber && <div className="error-message">{errors.AccountNumber[0]}</div>}
        </div>

        <div className="form-group">
          <label>ID Number</label>
          <input
            type="text"
            name="idNumber"
            value={formData.idNumber}
            onChange={handleChange}
            
          />
          {errors.IdNumber && <div className="error-message">{errors.IdNumber[0]}</div>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            
          />
          {errors.Password && <div className="error-message">{errors.Password[0]}</div>}
        </div>

        <button type="submit" className="register-btn">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;
