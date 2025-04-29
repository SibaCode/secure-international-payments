import React, { useEffect, useState } from 'react';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
import './../employee/css/EmployeeDashboardPage.css';
import Navbar from '../../components/EmployeeNavbar';
import Notification from './../../Notification';

function EmployeeDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const employeeName = localStorage.getItem('username') || 'Employee';

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('https://localhost:7150/api/Transactions');
        const data = await response.json();
        setTransactions(data);
      } catch (err) {
        setError('Failed to fetch transactions');
      }
    };
    fetchTransactions();
  }, []);

  const openModal = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleVerify = async () => {
    const updatedTransaction = { ...selectedTransaction, status: 'Verified' };

    const response = await fetch(`https://localhost:7150/api/Transactions/${selectedTransaction.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTransaction),
    });

    if (response.ok) {
      setTransactions((prev) =>
        prev.map((txn) => (txn.id === selectedTransaction.id ? updatedTransaction : txn))
      );
      setSuccess('Transaction verified successfully');
      closeModal();
    } else {
      setError('Failed to verify transaction');
    }
  };

  return (
    <div>
      <Navbar employeeName={employeeName} />
      <div className="dashboard-container">
        <h2>Employee Dashboard</h2>
        <h3>Welcome, {employeeName}</h3>
        {success && <Notification message={success} type="success" />}
        {error && <Notification message={error} type="error" />}

        <table className="transactions-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Account Number</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.id}</td>
                <td>{transaction.accountNumber}</td>
                <td>{transaction.status}</td>
                <td>
                  <button onClick={() => openModal(transaction)}>Verify</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isModalOpen && (
  <div className="modal">
    <div className="modal-content">
      <h3>Transaction Details</h3>
      <p><strong>Transaction ID:</strong> {selectedTransaction.id}</p>
      <p><strong>Account Number:</strong> {selectedTransaction.accountNumber}</p>
      <p><strong>Status:</strong> {selectedTransaction.status}</p>

      {selectedTransaction.status === 'Verified' ? (
        <>
          <p style={{ color: 'green', fontWeight: 'bold' }}>
            This transaction has already been verified.
          </p>
          <div className="modal-buttons">
            <button onClick={closeModal}>Back</button>
          </div>
        </>
      ) : (
        <>
          <p>Are you sure you want to verify this transaction?</p>
          <div className="modal-buttons">
            <button onClick={handleVerify}>Verify</button>
            <button onClick={closeModal}>Cancel</button>
          </div>
        </>
      )}
    </div>
  </div>
)}

      </div>
    </div>
  );
}

export default EmployeeDashboardPage;
