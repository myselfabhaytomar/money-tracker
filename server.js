const express = require('express');
const sqlite3 = require('sqlite3');
const path = require('path');

const app = express();
const port = 3000;

// Connect to SQLite database
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'));

// Middleware to parse JSON data
app.use(express.json());

// Serve static files
app.use(express.static('public', { 'extensions': ['html', 'htm', 'js', 'css'], 'index': false }));

// Create 'transactions' table if it doesn't exist
db.run('CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY, amount REAL, category TEXT)');

// Define routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/addTransaction', (req, res) => {
  const { amount, category } = req.body;

  // Insert the transaction into the database
  db.run('INSERT INTO transactions (amount, category) VALUES (?, ?)', [amount, category], (err) => {
    if (err) {
      console.error('Error adding transaction:', err.message);
      return res.status(500).json({ error: 'Error adding transaction' });
    }

    res.status(200).json({ message: 'Transaction added successfully' });
  });
});

app.get('/getTransactions', (req, res) => {
  // Retrieve all transactions from the database
  db.all('SELECT * FROM transactions', (err, rows) => {
    if (err) {
      console.error('Error retrieving transactions:', err.message);
      return res.status(500).json({ error: 'Error retrieving transactions' });
    }

    res.status(200).json(rows);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
