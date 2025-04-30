import React, { useState } from 'react';
import { Routes, Route, useNavigate , Navigate} from 'react-router-dom';
import DashboardPage from './components/customer/DashboardPage';
import RegisterPage from './components/customer/RegisterPage';
import LoginPage from './components/customer/LoginPage';
import EmployeeLoginPage from './components/employee/EmployeeLoginPage';
import EmployeeDashboardPage from './components/employee/EmployeeDashboardPage'; 
import ProtectedRoute from './components/ProtectedRoute'; 
import { AuthProvider } from  './AuthContext.js';

function App() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <h1>App Loaded</h1> {/* Add this as a quick visual indicator */}
      <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/employee" element={<EmployeeLoginPage />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboardPage />} />
      </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
