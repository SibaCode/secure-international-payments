import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import './../employee/css/EmployeeDashboardPage.css';
import Navbar from '../../components/Navbar';

const apiBaseUrl = 'https://localhost:7150/api/TransactionDetails';

const EmployeeDashboardPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('employeeToken');
    if (!token) {
      setIsAuthenticated(false);
    } else {
      fetchTransactions(token);
    }
  }, []);

  const fetchTransactions = async (token) => {
    try {
      const res = await axios.get(apiBaseUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Error fetching transactions');
    }
  };

  const openModal = (transaction) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedTransaction(null);
    setShowModal(false);
    setError('');
    setSuccess('');
  };

  const handleVerify = async () => {
    if (selectedTransaction.status === 'Verified') {
      setError('This transaction has already been verified.');
      return;
    }

    try {
      const response = await fetch(`https://localhost:7150/api/TransactionDetails/verify/${selectedTransaction.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Verification failed');

      const updatedTransaction = await response.json();
      setTransactions(prevTransactions =>
        prevTransactions.map(transaction =>
          transaction.id === updatedTransaction.id ? updatedTransaction : transaction
        )
      );
      setSuccess('Transaction verified successfully!');
      closeModal();
    } catch (err) {
      console.error(err);
      setError('Verification failed. Please try again.');
    }
  };

  if (!isAuthenticated) return <Navigate to="/employee-login" />;

  return (
    
    <div>
    <Navbar userType="Employee" />
    <div className="dashboard-container">
      
      <h2>Employee Dashboard</h2>

      {/* Success and Error Messages */}
      {success && <div style={successMessageStyle}>{success}</div>}
      {error && <div style={errorMessageStyle}>{error}</div>}

      <table border="1" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Provider</th>
            <th>Status</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td>{tx.id}</td>
              <td>{tx.amount}</td>
              <td>{tx.currency}</td>
              <td>{tx.provider}</td>
              <td>{tx.status}</td>
              <td>{new Date(tx.date).toLocaleString()}</td>
              <td>
               <button
                onClick={() => openModal(tx)}
                disabled={tx.status === 'Verified'}
                className={tx.status === 'Verified' ? 'verified-btn' : 'verify-btn'}
              >
                {tx.status === 'Verified' ? 'Verified' : 'Verify'}
              </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && selectedTransaction && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3>Transaction Details</h3>
            <p><strong>ID:</strong> {selectedTransaction.id}</p>
            <p><strong>Amount:</strong> {selectedTransaction.amount}</p>
            <p><strong>Currency:</strong> {selectedTransaction.currency}</p>
            <p><strong>Provider:</strong> {selectedTransaction.provider}</p>
            <p><strong>Status:</strong> {selectedTransaction.status}</p>
            <p><strong>Date:</strong> {new Date(selectedTransaction.date).toLocaleString()}</p>

            {selectedTransaction.status === 'Verified' ? (
  <p>✅ This transaction has already been verified.</p>
) : (
  <button className="verify-btn" onClick={handleVerify}>Confirm Verification</button>
)}
<br />
<button className="close-btn" onClick={closeModal}>Close</button>

          </div>
        </div>
      )}
    </div>
  </div>
    
  );
};

// Styling for success/error messages
const successMessageStyle = {
  backgroundColor: 'green',
  color: 'white',
  padding: '10px',
  marginBottom: '20px',
  borderRadius: '5px',
  textAlign: 'center',
};

const errorMessageStyle = {
  backgroundColor: 'red',
  color: 'white',
  padding: '10px',
  marginBottom: '20px',
  borderRadius: '5px',
  textAlign: 'center',
};

// Minimal inline modal styling
const modalOverlayStyle = {
  position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
  alignItems: 'center', justifyContent: 'center', zIndex: 999,
};

const modalContentStyle = {
  backgroundColor: '#fff', padding: 20, borderRadius: 8,
  width: '400px', maxWidth: '90%',
};

export default EmployeeDashboardPage;
