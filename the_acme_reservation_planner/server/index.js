const express = require('express');
const { 
  client, 
  createTables, 
  createCustomer, 
  createRestaurant, 
  fetchCustomers, 
  fetchRestaurants, 
  createReservation, 
  destroyReservation 
} = require('./db');
const app = express();
const port = 3000;

app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

createTables();

app.get('/api/customers', async (req, res) => {
  const customers = await fetchCustomers();
  res.json(customers);
});

app.get('/api/restaurants', async (req, res) => {
  const restaurants = await fetchRestaurants();
  res.json(restaurants);
});

app.get('/api/reservations', async (req, res) => {
  const result = await client.query('SELECT * FROM reservations');
  res.json(result.rows);
});

app.post('/api/customers/:id/reservations', async (req, res) => {
  const { id } = req.params;
  const { date, party_count, restaurant_id } = req.body;
  const reservation = await createReservation(id, date, party_count, restaurant_id, id);
  res.status(201).json(reservation);
});

app.delete('/api/customers/:customer_id/reservations/:id', async (req, res) => {
  const { id } = req.params;
  await destroyReservation(id);
  res.status(204).send();
});

// Error handling
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});
