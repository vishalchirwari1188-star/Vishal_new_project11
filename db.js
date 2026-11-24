const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'cafe.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to SQLite database at cafe.db');
  }
});

db.serialize(() => {
  // Menu items table (Coffee & Food)
  db.run(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT,
      is_available INTEGER DEFAULT 1
    )
  `);

  // Orders table
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      items_json TEXT NOT NULL,
      total_amount REAL NOT NULL,
      status TEXT DEFAULT 'Pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Table reservations table
  db.run(`
    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      email TEXT,
      phone TEXT NOT NULL,
      guests INTEGER NOT NULL,
      reservation_date TEXT NOT NULL,
      reservation_time TEXT NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Contact / feedback messages table
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed default menu items if empty
  db.get('SELECT COUNT(*) AS count FROM menu_items', (err, row) => {
    if (!err && row && row.count === 0) {
      const stmt = db.prepare(
        'INSERT INTO menu_items (name, category, price, description) VALUES (?, ?, ?, ?)'
      );
      const initialItems = [
        ['Classic Cappuccino', 'Coffee', 149, 'Rich espresso topped with steamed milk and micro-foam.'],
        ['Cold Brew Latte', 'Coffee', 179, 'Slow-steeped cold brew coffee blended with chilled milk.'],
        ['Hazelnut Mocha', 'Coffee', 199, 'Espresso, dark chocolate, roasted hazelnut syrup, and milk.'],
        ['Grilled Paneer Sandwich', 'Food', 169, 'Spiced cottage cheese, bell peppers, and mint chutney on toasted bread.'],
        ['Peri-Peri Fries', 'Food', 129, 'Crispy golden fries tossed in tangy peri-peri seasoning.'],
        ['Blueberry Cheesecake Slice', 'Dessert', 219, 'Creamy baked cheesecake topped with compote.']
      ];
      for (const item of initialItems) {
        stmt.run(item);
      }
      stmt.finalize();
      console.log('Seeded initial cafe menu items.');
    }
  });
});

module.exports = db;
