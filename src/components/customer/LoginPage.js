import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext'; // Make sure the path is correct
import './../customer/css/LoginPage.css'; // Your styling

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth(); // Only get login from context

  const [formData, setFormData] = useState({
    fullName: '',
    accountNumber: '',
    password: '',
  });

  const [error, setError] = useState(''); // State for handling error message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = await login(formData, 'customer'); // ✅ Let context handle login

      setError(''); // Clear any previous error message

      // Redirect based on role after login
      if (userData?.role === "customer") {
        navigate('/dashboard');
      } else if (userData?.role === "employee") {
        navigate('/employee-dashboard');
      } else {
        navigate('/'); // Fallback route
      }

    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
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
