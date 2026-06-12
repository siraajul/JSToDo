// Data-access layer for users. All user SQL lives here.
const pool = require('../db');

// Find a single user by email, or null if none.
async function findByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
}

// Insert a new user and return the new id.
async function create({ name, email, password }) {
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, password]
  );
  return result.insertId;
}

module.exports = { findByEmail, create };
