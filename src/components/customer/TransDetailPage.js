import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Notification from './../../Notification';
import Navbar from '../../components/Navbar';
import './../customer/css/DashboardPage.css';

const apiBaseUrl = 'https://localhost:7150/api/TransactionDetails'; // replace with your actual backend URL

const TransDetailPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    id: 0,
    amount: '',
    currency: '',
    provider: '',
    status: '',
    date: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(apiBaseUrl);
      setTransactions(res.data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${apiBaseUrl}/${editingId}`, form);
      } else {
        await axios.post(apiBaseUrl, form);
      }
      setForm({ id: 0, amount: '', currency: '', provider: '', status: '', date: '' });
      setEditingId(null);
      setIsModalOpen(false); // Close the modal after submission
      fetchTransactions();
    } catch (err) {
      console.error('Error saving transaction:', err);
    }
  };

  const handleEdit = (tx) => {
    setForm(tx);
    setEditingId(tx.id);
    setIsModalOpen(true); // Open modal when editing
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiBaseUrl}/${id}`);
      fetchTransactions();
    } catch (err) {
      console.error('Error deleting transaction:', err);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setForm({ id: 0, amount: '', currency: '', provider: '', status: '', date: '' });
    setEditingId(null);
  };

return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <h2>Customer Dashboard</h2>
        {/* <h3>Welcome, {user?.fullName}</h3> */}

        {/* {success && <Notification message={success} type="success" />}
        {error && <Notification message={error} type="error" />} */}

        <h3>Transaction History</h3>
        <button onClick={toggleModal}>Add New Transaction</button>

        <table border="1" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Provider</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
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
                <button onClick={() => handleEdit(tx)}>Edit</button>
                <button onClick={() => handleDelete(tx.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

{/* Modal to add/edit transaction */}
{isModalOpen && (
  <div className="modal">
    <div className="modal-content">
      <h3>{editingId ? 'Edit Transaction' : 'New Transaction'}</h3>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <div>
          <label>Amount:</label>
          <input type="number" name="amount" value={form.amount} onChange={handleChange} required />
        </div>
        <div>
          <label>Currency:</label>
          <input type="text" name="currency" value={form.currency} onChange={handleChange} required />
        </div>
        <div>
          <label>Provider:</label>
          <input type="text" name="provider" value={form.provider} onChange={handleChange} required />
        </div>
        <div>
          <label>Status:</label>
          <input type="text" name="status" value={form.status} onChange={handleChange} required />
        </div>
        <div>
          <label>Date:</label>
          <input type="datetime-local" name="date" value={form.date} onChange={handleChange} required />
        </div>
        <button type="submit">{editingId ? 'Update' : 'Create'}</button>
        <button onClick={toggleModal} type="button">Close</button>
      </form>
    </div>
  </div>
)}

      </div>
    </>
  );
};

export default TransDetailPage;
