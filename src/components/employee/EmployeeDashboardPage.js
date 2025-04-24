import React, { useState, useEffect } from 'react';
import { mockTransactions } from './../../mockData'; // Import mock data
import './../employee/css/EmployeeDashboardPage.css'; // Add custom styles
import Notification from './../../Notification'; // Import the Notification component
import Navbar from '../../components/Navbar';

function EmployeeDashboardPage() {
  const [transactions, setTransactions] = useState(mockTransactions); // Use mock data initially
  const [selectedTransaction, setSelectedTransaction] = useState(null); // Store selected transaction for modal
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Track if the modal is open

  // Open the modal to verify or flag a transaction
  const openModal = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  // Handle verify action
  const handleVerify = (transactionId) => {
    setTransactions(prevTransactions =>
      prevTransactions.map(tx =>
        tx.id === transactionId ? { ...tx, status: 'verified' } : tx
      )
    );
    setSuccess('Transaction verified successfully');
    closeModal(); // Close modal after action
  };

  // Handle flag action
  const handleFlag = (transactionId) => {
    setTransactions(prevTransactions =>
      prevTransactions.map(tx =>
        tx.id === transactionId ? { ...tx, status: 'flagged' } : tx
      )
    );
    setSuccess('Transaction flagged as suspicious');
    closeModal(); // Close modal after action
  };

  return (
    <>
      <Navbar userType="Employee" />
      <div className="employee-dashboard-container">
        <h2>Employee Dashboard</h2>

        {success && <Notification message={success} type="success" />}
        {error && <Notification message={error} type="error" />}

        <h3>Pending Transactions</h3>
        <table>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Currency</th>
              <th>Provider</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.amount}</td>
                <td>{transaction.currency}</td>
                <td>{transaction.provider}</td>
                <td>{transaction.status}</td>
                <td>
                  <button
                    disabled={transaction.status === 'verified' || transaction.status === 'flagged'}
                    onClick={() => openModal(transaction)}
                  >
                    Open
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal for verifying or flagging a transaction */}
        {isModalOpen && selectedTransaction && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Transaction Details</h3>
              <p><strong>Amount:</strong> {selectedTransaction.amount}</p>
              <p><strong>Currency:</strong> {selectedTransaction.currency}</p>
              <p><strong>Provider:</strong> {selectedTransaction.provider}</p>
              <p><strong>Status:</strong> {selectedTransaction.status}</p>

              <button onClick={() => handleVerify(selectedTransaction.id)}>Verify</button>
              <button onClick={() => handleFlag(selectedTransaction.id)}>Flag</button>
              <button onClick={closeModal}>Close</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default EmployeeDashboardPage;
