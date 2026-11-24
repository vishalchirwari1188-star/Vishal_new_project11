// Example snippet to connect your existing HTML/CSS/JS frontend to http://localhost:5000
const API_BASE = 'http://localhost:5000/api';

// 1. Fetch menu items from database
async function loadMenu(category = 'All') {
  const url = `${API_BASE}/menu?category=${encodeURIComponent(category)}`;
  const res = await fetch(url);
  const data = await res.json();
  console.log('Menu items:', data.items);
  return data.items;
}

// 2. Submit a food/coffee order
async function submitOrder(customerName, phone, cartItems) {
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customer_name: customerName,
      phone: phone,
      items: cartItems,
      total_amount: totalAmount
    })
  });
  return await res.json();
}

// 3. Book a cafe table
async function bookTable(reservationData) {
  const res = await fetch(`${API_BASE}/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reservationData)
  });
  return await res.json();
}

// 4. Send contact form message
async function sendMessage(contactData) {
  const res = await fetch(`${API_BASE}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contactData)
  });
  return await res.json();
}
