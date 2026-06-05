import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const menu = [
  { id: 1, name: 'Margherita', price: 12, description: 'Tomato, mozzarella, basil, olive oil.', tag: 'Classic' },
  { id: 2, name: 'Pepperoni Blaze', price: 15, description: 'Pepperoni, mozzarella, spicy tomato sauce.', tag: 'Spicy' },
  { id: 3, name: 'Garden Glow', price: 14, description: 'Mushrooms, peppers, olives, fresh herbs.', tag: 'Veggie' },
  { id: 4, name: 'BBQ Chicken', price: 16, description: 'BBQ chicken, red onion, cheddar, cilantro.', tag: 'Signature' },
];

const reservations = [
  { id: 1, name: 'Ava', date: '2026-06-10', time: '19:00', guests: 4, status: 'Confirmed' },
  { id: 2, name: 'Noah', date: '2026-06-11', time: '20:30', guests: 2, status: 'Pending' },
];

const orders = [];

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Pizza app API is running.' });
});

app.get('/api/menu', (_req, res) => {
  res.json(menu);
});

app.post('/api/orders', (req, res) => {
  const { name, items, quantity, notes } = req.body;

  const order = {
    id: Date.now(),
    name,
    items,
    quantity: Number(quantity) || 1,
    notes: notes || 'No notes',
    status: 'Received',
  };

  orders.push(order);
  res.status(201).json({ success: true, order });
});

app.get('/api/reservations', (_req, res) => {
  res.json(reservations);
});

app.post('/api/reservations', (req, res) => {
  const { name, date, time, guests } = req.body;

  const reservation = {
    id: Date.now(),
    name,
    date,
    time,
    guests: Number(guests) || 2,
    status: 'Booked',
  };

  reservations.push(reservation);
  res.status(201).json({ success: true, reservation });
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  res.json({ success: true, message: `Thanks ${name || 'there'}! We received your note and will reply to ${email || 'your email'}.` });
});

app.listen(PORT, () => {
  console.log(`Pizza app API listening on http://localhost:${PORT}`);
});
