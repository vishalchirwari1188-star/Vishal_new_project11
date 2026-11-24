const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Cafe Backend API is running' });
});

// ---------------- MENU ENDPOINTS ----------------
app.get('/api/menu', (req, res) => {
  const { category } = req.query;
  let sql = 'SELECT * FROM menu_items WHERE is_available = 1';
  const params = [];

  if (category && category.toLowerCase() !== 'all') {
    sql += ' AND LOWER(category) = LOWER(?)';
    params.push(category);
  }

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ items: rows });
  });
});

app.post('/api/menu', (req, res) => {
  const { name, category, price, description } = req.body;
  if (!name || !category || price === undefined) {
    return res.status(400).json({ error: 'name, category, and price are required' });
  }
  const sql = 'INSERT INTO menu_items (name, category, price, description) VALUES (?, ?, ?, ?)';
  db.run(sql, [name, category, Number(price), description || ''], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, name, category, price: Number(price), description: description || '' });
  });
});

// ---------------- ORDERS ENDPOINTS ----------------
app.post('/api/orders', (req, res) => {
  const { customer_name, phone, items, total_amount } = req.body;
  if (!customer_name || !phone || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'customer_name, phone, and non-empty items array are required' });
  }

  const calculatedTotal =
    total_amount !== undefined
      ? Number(total_amount)
      : items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 1), 0);

  const sql = 'INSERT INTO orders (customer_name, phone, items_json, total_amount) VALUES (?, ?, ?, ?)';
  db.run(sql, [customer_name, phone, JSON.stringify(items), calculatedTotal], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({
      message: 'Order placed successfully',
      order_id: this.lastID,
      total_amount: calculatedTotal,
      status: 'Pending'
    });
  });
});

app.get('/api/orders', (req, res) => {
  db.all('SELECT * FROM orders ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const formatted = rows.map((r) => ({
      ...r,
      items: JSON.parse(r.items_json || '[]')
    }));
    res.json({ orders: formatted });
  });
});

// ---------------- RESERVATIONS ENDPOINTS ----------------
app.post('/api/reservations', (req, res) => {
  const { customer_name, email, phone, guests, reservation_date, reservation_time, notes } = req.body;
  if (!customer_name || !phone || !guests || !reservation_date || !reservation_time) {
    return res.status(400).json({
      error: 'customer_name, phone, guests, reservation_date, and reservation_time are required'
    });
  }

  const sql = `
    INSERT INTO reservations (customer_name, email, phone, guests, reservation_date, reservation_time, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.run(
    sql,
    [customer_name, email || '', phone, Number(guests), reservation_date, reservation_time, notes || ''],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({
        message: 'Table reservation confirmed',
        reservation_id: this.lastID
      });
    }
  );
});

app.get('/api/reservations', (req, res) => {
  db.all('SELECT * FROM reservations ORDER BY reservation_date ASC, reservation_time ASC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ reservations: rows });
  });
});

// ---------------- CONTACT / MESSAGES ENDPOINTS ----------------
app.post('/api/messages', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email, and message are required' });
  }

  const sql = 'INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)';
  db.run(sql, [name, email, subject || 'General Inquiry', message], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({
      message: 'Message received! We will get back to you soon.',
      message_id: this.lastID
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
