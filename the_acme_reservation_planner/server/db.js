const { Client } = require('pg');
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'acme_reservations',
  password: 'npoe5030',
  port: 5432,
});

client.connect();

const createTables = async () => {
  await client.query(`
    DROP TABLE IF EXISTS reservations;
    DROP TABLE IF EXISTS customers;
    DROP TABLE IF EXISTS restaurants;

    CREATE TABLE customers (
      id UUID PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );

    CREATE TABLE restaurants (
      id UUID PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );

    CREATE TABLE reservations (
      id UUID PRIMARY KEY,
      date DATE NOT NULL,
      party_count INTEGER NOT NULL,
      restaurant_id UUID REFERENCES restaurants(id) NOT NULL,
      customer_id UUID REFERENCES customers(id) NOT NULL
    );
  `);
};

const createCustomer = async (id, name) => {
  const result = await client.query(
    'INSERT INTO customers (id, name) VALUES ($1, $2) RETURNING *', 
    [id, name]
  );
  return result.rows[0];
};

const createRestaurant = async (id, name) => {
  const result = await client.query(
    'INSERT INTO restaurants (id, name) VALUES ($1, $2) RETURNING *', 
    [id, name]
  );
  return result.rows[0];
};

const fetchCustomers = async () => {
  const result = await client.query('SELECT * FROM customers');
  return result.rows;
};

const fetchRestaurants = async () => {
  const result = await client.query('SELECT * FROM restaurants');
  return result.rows;
};

const createReservation = async (id, date, party_count, restaurant_id, customer_id) => {
  const result = await client.query(
    'INSERT INTO reservations (id, date, party_count, restaurant_id, customer_id) VALUES ($1, $2, $3, $4, $5) RETURNING *', 
    [id, date, party_count, restaurant_id, customer_id]
  );
  return result.rows[0];
};

const destroyReservation = async (id) => {
  await client.query('DELETE FROM reservations WHERE id = $1', [id]);
};

module.exports = {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  fetchCustomers,
  fetchRestaurants,
  createReservation,
  destroyReservation
};
