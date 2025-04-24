import React, { useState, useEffect } from 'react';
import './../customer/css/DashboardPage.css'; // Add custom styles
import Notification from './../../Notification'; // Import the Notification component
import Navbar from '../../components/Navbar';

function DashboardPage() {
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
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  // Fetch transaction history (using mock data for now)
  useEffect(() => {
    const mockTransactions = [
      { id: 1, amount: 200, currency: 'USD', provider: 'SWIFT', status: 'Completed' },
      { id: 2, amount: 300, currency: 'EUR', provider: 'SWIFT', status: 'Pending' },
      // Add more mock data as needed
    ];
    setTransactions(mockTransactions);
  }, []);

  // Handle input changes for new transaction form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission for new payment
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simulate adding the transaction (mock data submission)
    const newTransactionWithId = { ...newTransaction, id: transactions.length + 1, status: 'Pending' };
    setTransactions([newTransactionWithId, ...transactions]);
    setSuccess('Transaction submitted successfully');
    setNewTransaction({
      amount: '',
      currency: '',
      provider: 'SWIFT',
      accountNumber: '',
      swiftCode: '',
    });
    setIsModalOpen(false); // Close the modal
  };

  // Handle open/close modal
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <>
      <Navbar userType="Customer" />
      <div className="dashboard-container">
        <h2>Customer Dashboard</h2>

        {/* Display Success or Error Notifications */}
        {success && <Notification message={success} type="success" />}
        {error && <Notification message={error} type="error" />}

        {/* Transaction History */}
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

        {/* Add New Transaction Button */}
        <button onClick={toggleModal}>Add New Transaction</button>

        {/* Modal for New Transaction */}
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h3>Initiate a New Payment</h3>
              <form onSubmit={handleSubmit}>
                <div>
                  <label>Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={newTransaction.amount}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label>Currency</label>
                  <input
                    type="text"
                    name="currency"
                    value={newTransaction.currency}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label>Provider</label>
                  <select
                    name="provider"
                    value={newTransaction.provider}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="SWIFT">SWIFT</option>
                    {/* Add more providers here */}
                  </select>
                </div>
                <div>
                  <label>Account Number</label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={newTransaction.accountNumber}
                    onChange={handleInputChange}
                    required
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
