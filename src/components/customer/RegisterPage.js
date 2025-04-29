import React, { useState } from 'react';
import './../customer/css/RegisterPage.css';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    accountNumber: '',
    password: '',
    idNumber: '',
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: null })); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form fields using RegEx
    const fullNameRegex = /^[A-Za-z\s]{2,50}$/;
    const accountNumberRegex = /^[0-9]{6,20}$/;
    const idNumberRegex = /^[0-9]{6,20}$/;

    if (!fullNameRegex.test(formData.fullName)) {
      setErrors({ FullName: ['Full Name is invalid. Only letters and spaces are allowed.'] });
      return;
    }

    if (!accountNumberRegex.test(formData.accountNumber)) {
      setErrors({ AccountNumber: ['Account Number must be digits only.'] });
      return;
    }

    if (!idNumberRegex.test(formData.idNumber)) {
      setErrors({ IdNumber: ['ID Number must be digits only.'] });
      return;
    }

    if (formData.password.length < 6) {
      setErrors({ Password: ['Password must be at least 6 characters long.'] });
      return;
    }

    // Hash the password before sending it to the backend
    const hashedPassword = await bcrypt.hash(formData.password, 10); // 10 is the salt rounds

    // Replace the plain text password with the hashed password
    const registrationData = { ...formData, password: hashedPassword };

    try {
      const response = await fetch('https://localhost:7150/api/Customers/Register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData),
      });

      if (response.ok) {
        navigate('/login');
      } else {
        const errorData = await response.json();
        if (errorData.errors) {
          setErrors(errorData.errors); // Set errors if validation fails
        } else {
          alert(errorData.message || 'Registration failed');
        }
      }
    } catch (err) {
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
            value="Zungu SBAA"
            onChange={handleChange}
          />
          {errors.FullName && <div className="error-message">{errors.FullName[0]}</div>}
        </div>

        <div className="form-group">
          <label>Account Number</label>
          <input
            type="number"
            name="accountNumber"
            value="258147369"
            onChange={handleChange}
          />
          {errors.AccountNumber && <div className="error-message">{errors.AccountNumber[0]}</div>}
        </div>

        <div className="form-group">
          <label>ID Number</label>
          <input
            type="number"
            name="idNumber"
            value="258147369"
            onChange={handleChange}
          />
          {errors.IdNumber && <div className="error-message">{errors.IdNumber[0]}</div>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value="258147369"
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
