import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Notification from './../../Notification';
import { useAuth } from '../../../src/AuthContext';
import './../customer/css/DashboardPage.css';

const apiBaseUrl = 'https://localhost:7150/api/TransactionDetails';
const apiBaseUrl1 = 'https://localhost:7150/api/TransactionDetails';

const DashboardPage = () => {
  const { user } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    id: 0,
    amount: '',
    currency: '',
    swiftCode: '',
    status: '',
    date: new Date().toISOString(),
    
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchTransactions();
    }
  }, [user]);
  const fetchTransactions = async () => {
  try {
    const res = await axios.get(`${apiBaseUrl}/account/${user.accountNumber}`);
    // const res = await axios.get(`${apiBaseUrl1}/account/617754`);

    // https://localhost:7150/api/TransactionDetails/account/3584737380
    setTransactions(res.data);
    console.log(transactions.length);

  } catch (err) {
    console.error(err);
    // setError('Failed to load transactions');
  }
};

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        accountNumber: user.accountNumber, // Fixed typo: accountNumbe -> accountNumber
        status: 'Pending',
        date: new Date().toISOString(),
      };
      await axios.post(apiBaseUrl, payload);
      setSuccess('Transaction created successfully');
      console.log('User details:', user.accountNumber);
      resetForm();
      fetchTransactions();
    } catch (err) {
      console.error(err);
      setError('Transaction failed');
    }
  };
  

  

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiBaseUrl}/${id}`);
      setSuccess('Transaction deleted');
      fetchTransactions();
    } catch (err) {
      console.error(err);
      setError('Failed to delete transaction');
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setForm({
      id: 0,
      amount: '',
      currency: '',
      swiftCode: '',
      status: 'Pending',
      date: new Date().toISOString(),
    });
  };

  const resetForm = () => {
    setForm({
      id: 0,
      amount: '',
      currency: '',
      swiftCode: '',
      status: 'Pending',
      date: new Date().toISOString(),
    });
    setIsModalOpen(false);
  };

  return (
    <>
      <Navbar userType="Customer" />
      <div className="dashboard-container">
        <h2>Customer Dashboard</h2>
        <h3>Welcome, {user?.fullName}</h3>
        {success && <Notification message={success} type="success" />}
        {error && <Notification message={error} type="error" />}
        <h3>Transaction History</h3>
<button className="verify-btn" onClick={toggleModal}>Add New Transaction</button>

{transactions.length === 0 && !error ? (
  <p>You have no transactions yet.</p>
) : (
  <table border="1" width="100%">
    <thead>
      <tr>
        <th>ID</th>
        <th>Amount</th>
        <th>Currency</th>
        <th>SWIFT Code</th>
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
            <span className={`status-pill ${tx.status.toLowerCase()}`}>
              {tx.status === 'Verified' ? 'Verified' : 'Pending'}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)}


        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h3>{'New Transaction'}</h3>
              <form onSubmit={handleSubmit}>
                <div>
                  <label>Amount:</label>
                  <input type="number" name="amount" value={form.amount} onChange={handleChange} required />
                </div>
                <div>
                  <label>Currency:</label>
                  <select name="currency" value={form.currency} onChange={handleChange} required>
                    <option value="">Select currency</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="ZAR">ZAR</option>
                  </select>
                </div>
                <div>
                  <label>SWIFT Code:</label>
                  <input type="text" name="swiftCode" value={form.swiftCode} onChange={handleChange} required />
                </div>
                <button type="submit">Create</button>
                <button type="button" onClick={toggleModal}>Close</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardPage;
