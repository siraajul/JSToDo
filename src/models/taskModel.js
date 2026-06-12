// Data-access layer for tasks. All task SQL lives here and is scoped by user.
const pool = require('../db');

// Insert a task for a user and return the full created row.
async function create(userId, { title, description, dueDate, priority }) {
  const [result] = await pool.query(
    'INSERT INTO tasks (userId, title, description, dueDate, priority, status) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, title, description || null, dueDate || null, priority, 'Pending']
  );
  return findById(result.insertId);
}

// Find a task by its id (no user scoping — used right after insert).
async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
  return rows[0] || null;
}

// All tasks belonging to a user, ordered by id.
async function findAllByUser(userId) {
  const [rows] = await pool.query(
    'SELECT * FROM tasks WHERE userId = ? ORDER BY id',
    [userId]
  );
  return rows;
}

// A single task, but only if it belongs to the given user.
async function findByIdForUser(id, userId) {
  const [rows] = await pool.query(
    'SELECT * FROM tasks WHERE id = ? AND userId = ?',
    [id, userId]
  );
  return rows[0] || null;
}

// Update an existing task owned by the user.
async function update(id, userId, { title, description, dueDate, priority }) {
  await pool.query(
    'UPDATE tasks SET title = ?, description = ?, dueDate = ?, priority = ? WHERE id = ? AND userId = ?',
    [title, description || null, dueDate || null, priority, id, userId]
  );
}

// Delete a task owned by the user.
async function remove(id, userId) {
  await pool.query('DELETE FROM tasks WHERE id = ? AND userId = ?', [id, userId]);
}

// Search a user's tasks by title or description keyword.
async function search(userId, keyword) {
  const like = `%${keyword}%`;
  const [rows] = await pool.query(
    'SELECT * FROM tasks WHERE userId = ? AND (title LIKE ? OR description LIKE ?) ORDER BY id',
    [userId, like, like]
  );
  return rows;
}

module.exports = {
  create,
  findById,
  findAllByUser,
  findByIdForUser,
  update,
  remove,
  search,
};
