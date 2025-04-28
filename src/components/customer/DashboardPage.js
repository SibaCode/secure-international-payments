import React, { useState, useEffect } from 'react';
import './../customer/css/DashboardPage.css';
import Notification from './../../Notification';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../../src/AuthContext';

function DashboardPage() {
  const { user } = useAuth();
  console.log('User in dashboard:', user);

  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    currency: '',
    provider: 'SWIFT',
    accountNumber: '',
    swiftCode: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const accountNumber = user?.accountNumber;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`https://localhost:7150/api/Transactions/customer/${user.accountNumber}`);
        if (!response.ok) throw new Error('Failed to fetch transactions');
        const data = await response.json();
        setTransactions(data);
      } catch (err) {
        console.error(err);
        setError('Could not load transactions.');
      }
    };

    if (user?.id) {
      fetchTransactions();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...newTransaction,
      accountNumber: user.accountNumber,
    };

    try {
      const response = await fetch('https://localhost:7150/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Transaction failed');
      const savedTransaction = await response.json();
      setTransactions([savedTransaction, ...transactions]);
      setSuccess('Transaction submitted successfully');
      setNewTransaction({
        amount: '',
        currency: '',
        provider: 'SWIFT',
        accountNumber: '',  
        swiftCode: '',
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      setError('Failed to submit transaction');
    }
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <>
      <Navbar userType="Customer" />
      <div className="dashboard-container">
        <h2>Customer Dashboard</h2>
        <h3>Welcome, {user?.fullName}</h3>

        {success && <Notification message={success} type="success" />}
        {error && <Notification message={error} type="error" />}

        <h3>Transaction History</h3>
        <table>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Currency</th>
              <th>Provider</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.id}>
                <td>{transaction.amount}</td>
                <td>{transaction.currency}</td>
                <td>{transaction.provider}</td>
                <td>{transaction.status}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {isModalOpen && (
  <div className="modal">
    <div className="modal-content">
      <h3>Initiate a New Payment</h3>
      <h4>Welcome, {user?.id}</h4>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            value={newTransaction.amount}
            onChange={handleInputChange}
            placeholder="Enter amount"
            required
          />
        </div>
        <div>
          <label>Currency</label>
          <select
            name="currency"
            value={newTransaction.currency}
            onChange={handleInputChange}
            required
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="ZAR">ZAR</option>
            {/* Add more currencies as needed */}
          </select>
        </div>
        <div>
          <label>Provider</label>
          <input
            type="text"
            name="provider"
            value="SWIFT"
            readOnly
          />
        </div>
        <div>
          <label>SWIFT Code</label>
          <input
            type="text"
            name="swiftCode"
            value={newTransaction.swiftCode}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Pay Now</button>
      </form>
      <button onClick={toggleModal}>Close</button>
    </div>
  </div>
)}
      </div>
    </>
  );
}

export default DashboardPage;
