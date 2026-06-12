// Reusable validation helpers used by auth and task modules.

const PRIORITIES = ['Low', 'Medium', 'High'];
const STATUSES = ['Pending', 'Completed'];

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Accepts any case ("high", "HIGH") and returns the canonical form,
// or null if it isn't a valid priority.
function normalizePriority(value) {
  const match = PRIORITIES.find(
    (p) => p.toLowerCase() === String(value).trim().toLowerCase()
  );
  return match || null;
}

function normalizeStatus(value) {
  const match = STATUSES.find(
    (s) => s.toLowerCase() === String(value).trim().toLowerCase()
  );
  return match || null;
}

// Validates a YYYY-MM-DD date and that it is a real calendar date.
function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  // Guard against rollovers like 2026-02-30 -> March.
  return value === date.toISOString().slice(0, 10);
}

module.exports = {
  PRIORITIES,
  STATUSES,
  isValidEmail,
  normalizePriority,
  normalizeStatus,
  isValidDate,
};
