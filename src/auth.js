// User registration and login (controller layer — delegates SQL to userModel).
const bcrypt = require('bcryptjs');
const userModel = require('./models/userModel');
const { ask } = require('./input');
const { isValidEmail } = require('./validators');
const ui = require('./ui');

// Use Case 1: Register a new user.
async function register() {
  console.log(ui.header('REGISTER'));

  const name = await ask(ui.field('Enter your name'));
  if (!name) {
    console.log(ui.error('Name cannot be empty.'));
    return;
  }

  const email = await ask(ui.field('Enter your email'));
  if (!isValidEmail(email)) {
    console.log(ui.error('Invalid email format.'));
    return;
  }

  const password = await ask(ui.field('Enter your password'));
  if (password.length < 4) {
    console.log(ui.error('Password must be at least 4 characters.'));
    return;
  }

  // Email must be unique.
  if (await userModel.findByEmail(email)) {
    console.log(ui.error('Email already exists.'));
    return;
  }

  const hash = await bcrypt.hash(password, 10);
  await userModel.create({ name, email, password: hash });

  console.log(ui.success('Registration successful!'));
}

// Use Case 2: Login an existing user. Returns the user row on success, else null.
async function login() {
  console.log(ui.header('LOGIN'));

  const email = await ask(ui.field('Enter your email'));
  const password = await ask(ui.field('Enter your password'));

  const user = await userModel.findByEmail(email);
  if (!user) {
    console.log(ui.error('Invalid email or password.'));
    return null;
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    console.log(ui.error('Wrong credential'));
    return null;
  }

  console.log(ui.success(`Login successful! Welcome back, ${user.name}.`));
  return user;
}

module.exports = { register, login };
