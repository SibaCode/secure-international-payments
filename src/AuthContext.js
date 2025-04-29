import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

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
        : 'https://localhost:7150/api/Customers/Login';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) throw new Error('Login failed');

    const data = await response.json();
    localStorage.setItem('token', data.token);

    let loggedInUser;

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

    setUser(loggedInUser);
    console.log('User set in context:', loggedInUser);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
