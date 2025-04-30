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
  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);

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
  const handleSendToSWIFT = async (tx) => {
    try {
      const response = await fetch(`https://localhost:7150/api/TransactionDetails/submit/${tx.id}`, {
        method: 'PUT'
      });
      if (response.ok) {
        const updatedTx = await response.json();
        // Update UI state here (e.g., refetch transactions or update locally)
        alert(`Transaction ${updatedTx.id} submitted to SWIFT`);
      } else {
        alert('Failed to submit to SWIFT.');
      }
    } catch (error) {
      console.error('Error sending to SWIFT:', error);
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
      setTransactions(prev =>
        prev.map(t => (t.id === updatedTransaction.id ? updatedTransaction : t))
      );
      setSuccess('Transaction verified successfully!');
      setIsReadyToSubmit(true); // 👈 Show the next step
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
            <th>Swift Code</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td>{tx.id}</td>
              <td>{tx.amount}</td>
              <td>{tx.currency}</td>
              <td>{tx.swiftCode}</td>
              <td>
              {tx.status === 'Pending' && (
  <button className="verify-btn" onClick={() => openModal(tx)}>
    Verify
  </button>
)}

{tx.status === 'Verified' && (
  <button
    className="send-btn-pill"
    disabled
    onClick={() => handleSendToSWIFT(tx)}
  >
    Submitted to SWIFT
  </button>
)}



{tx.status === 'Submitted' && (
  <span className="submitted-badge">✔ Submitted</span>
)}


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
            <p><strong>SWIFT Code:</strong> {selectedTransaction.swiftCode}</p>

            {selectedTransaction.status === 'Verified' && !isReadyToSubmit ? (
            <p>✅ This transaction has already been verified.</p>
          ) : !isReadyToSubmit ? (
            <button className="confirm-btn" onClick={handleVerify}>Confirm Verification</button>
          ) : (
            <button className="submit-swift-btn" onClick={closeModal}>Submit to SWIFT</button>
          )}

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
