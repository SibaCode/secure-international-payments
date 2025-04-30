import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create a Context for Authentication
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null; // Initialize state from localStorage if available
  });

  const navigate = useNavigate(); // We'll use navigate for redirection inside the login function

  // Effect hook to save user data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (credentials, userType = 'customer') => {
    const endpoint =
      userType === 'employee'
        ? 'https://localhost:7150/api/Employee/login'
        : 'https://localhost:7150/api/Customers/login';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token); // Store token

    let loggedInUser;
console.log("siba")
    if (userType === 'employee') {
      loggedInUser = {
        id: data.employee.id,
        username: data.employee.username,
        role: 'employee',
      };
    } else {
      loggedInUser = {
        fullName: data.customer.fullName,
        accountNumber: data.customer.accountNumber,
        id: data.customer.id,
        role: 'customer',
      };
    }

    setUser(loggedInUser); // Save user globally

    // Redirect based on role after login
    if (loggedInUser.role === 'customer') {
      navigate('/dashboard');
    } else if (loggedInUser.role === 'employee') {
      navigate('/employee-dashboard');
    }

    return loggedInUser; // return the logged-in user for use
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children} {/* Render the child components */}
    </AuthContext.Provider>
  );
};

// Custom hook to access the AuthContext
export const useAuth = () => useContext(AuthContext);
