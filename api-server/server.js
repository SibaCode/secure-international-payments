const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const SECRET = 'secretkey'; 

app.use(cors());
app.use(express.json());

// Dummy customer DB (you'll replace this with real DB later)
const customers = [
  {
    id: 1,
    username: 'customer1',
    accountNumber: '1234567890',
    password: '$2b$10$1', // 'password123'
  }
];

// Login Route
app.post('/api/customers/login', async (req, res) => {
  const { username, password, accountNumber } = req.body;
  const user = customers.find(
    (u) => u.username === username && u.accountNumber === accountNumber
  );

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials22' });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET, {
    expiresIn: '1h',
  });

  res.json({ token });
});

app.post('/api/customers/transactions', (req, res) => {
  const { amount, currency, provider, accountInfo, swiftCode } = req.body;

  if (!amount || !currency || !provider || !accountInfo || !swiftCode) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // In production, store this securely in DB
  console.log('Received transaction:', req.body);
  res.status(201).json({ message: 'Transaction submitted successfully' });
});
app.post('/api/employee/verify/:transactionId', (req, res) => {
  const { transactionId } = req.params;
  const transaction = transactions.find(tx => tx.id === parseInt(transactionId));
  
  if (!transaction) {
    return res.status(404).json({ message: 'Transaction not found' });
  }
  
  transaction.status = 'verified';
  res.json({ message: 'Transaction verified' });
});

app.post('/api/employee/flag/:transactionId', (req, res) => {
  const { transactionId } = req.params;
  const transaction = transactions.find(tx => tx.id === parseInt(transactionId));
  
  if (!transaction) {
    return res.status(404).json({ message: 'Transaction not found' });
  }
  
  transaction.status = 'flagged';
  res.json({ message: 'Transaction flagged as suspicious' });
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
