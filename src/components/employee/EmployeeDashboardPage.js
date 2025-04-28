import React, { useState, useEffect } from 'react';
import './../employee/css/EmployeeDashboardPage.css'; // Add custom styles
import Notification from './../../Notification'; // Import the Notification component
import Navbar from '../../components/Navbar';

function EmployeeDashboardPage() {
  const [transactions, setTransactions] = useState([]); // Store transactions from API
  const [selectedTransaction, setSelectedTransaction] = useState(null); // Store selected transaction for modal
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Track if the modal is open
  const [status, setStatus] = useState(''); // Track the selected status in the dropdown

  // Fetch transactions from API
  const fetchTransactions = async () => {
    try {
      const response = await fetch('https://localhost:7150/api/Employee/transactions');
      if (!response.ok) {
        throw new Error('Failed to load transactions');
      }
      const data = await response.json();
      setTransactions(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []); // Fetch transactions when the component mounts

  // Open the modal to verify or decline a transaction
  const openModal = (transaction) => {
    setSelectedTransaction(transaction);
    setStatus(transaction.status); // Set current status as default in the dropdown
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  // Handle the Save action based on dropdown selection (Verify or Decline)
  const handleSave = async () => {
    if (status === 'Verified') {
      await handleVerify(selectedTransaction.id);
    } else if (status === 'Declined') {
      await handleDecline(selectedTransaction.id);
    }
  };

  // Handle verify action (API call to verify the transaction)
  const handleVerify = async (transactionId) => {
    try {
      const response = await fetch(`https://localhost:7150/api/Employee/verify/${transactionId}`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Failed to verify transaction');
      }

      setTransactions(prevTransactions =>
        prevTransactions.map(tx =>
          tx.id === transactionId ? { ...tx, status: 'Verified' } : tx
        )
      );
      setSuccess('Transaction verified successfully');
      closeModal(); // Close modal after action
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle decline action (API call to decline the transaction)
  const handleDecline = async (transactionId) => {
    try {
      const response = await fetch(`https://localhost:7150/api/Employee/verify/${transactionId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'Declined' }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to decline transaction');
      }

      setTransactions(prevTransactions =>
        prevTransactions.map(tx =>
          tx.id === transactionId ? { ...tx, status: 'Declined' } : tx
        )
      );
      setSuccess('Transaction declined');
      closeModal(); // Close modal after action
    } catch (err) {
      setError(err.message);
    }
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
                    disabled={transaction.status === 'Verified' || transaction.status === 'Declined'}
                    onClick={() => openModal(transaction)}
                  >
                    Open
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal for updating transaction status */}
        {isModalOpen && selectedTransaction && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Transaction Details</h3>
              <p><strong>Amount:</strong> {selectedTransaction.amount}</p>
              <p><strong>Currency:</strong> {selectedTransaction.currency}</p>
              <p><strong>Provider:</strong> {selectedTransaction.provider}</p>
              <p><strong>Status:</strong>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)} // Update status based on dropdown selection
                >
                  <option value="Pending">Pending</option>
                  <option value="Verified">Verified</option>
                  <option value="Declined">Declined</option>
                </select>
              </p>

              <button onClick={handleSave}>Save</button>
              <button onClick={closeModal}>Close</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default EmployeeDashboardPage;
