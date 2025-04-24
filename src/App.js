import React, { useState } from 'react';
import { Routes, Route, useNavigate , Navigate} from 'react-router-dom';
import DashboardPage from './components/customer/DashboardPage';
import RegisterPage from './components/customer/RegisterPage';
import LoginPage from './components/customer/LoginPage';
import EmployeeLoginPage from './components/employee/EmployeeLoginPage'; // Import employee login page
import EmployeeDashboardPage from './components/employee/EmployeeDashboardPage'; // Import employee login page
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute

function App() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Ensure formData includes accountNumber
      });
  
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Store the token in localStorage
        navigate('/dashboard'); // Redirect to the dashboard
      } else {
        const error = await response.json();
        setError(error.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again later.');
    }
  };
  

  return (
    <div className="App">
      <Routes>
        {/* Login Route */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={ <DashboardPage />}  />
        <Route path="/employee-login" element={<EmployeeLoginPage />} /> {/* Employee login route */}
        <Route path="/employee-dashboard" element={<EmployeeDashboardPage />} /> {/* Employee dashboard route */}

      {/* Protected Routes */}
     <Route 
          path="/login" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/employee-dashboard" 
          element={
            <ProtectedRoute>
              <EmployeeDashboardPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;
