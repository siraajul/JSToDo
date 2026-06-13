// JS TODO App - entry point.
// Outer loop = Welcome menu; inner loop = Todo menu (after login).
const pool = require('./src/db');
const { ask, close } = require('./src/input');
const { register, login } = require('./src/auth');
const ui = require('./src/ui');
const {
  addTask,
  viewTasks,
  editTask,
  deleteTask,
  searchTasks,
} = require('./src/tasks');

async function pause() {
  await ask(ui.pausePrompt());
}

function printWelcomeMenu() {
  ui.clear();
  console.log(ui.header('WELCOME TO TODO APP'));
  console.log('');
  console.log(ui.menuItem('1', '📝', 'Register'));
  console.log(ui.menuItem('2', '🔑', 'Login'));
  console.log(ui.menuItem('3', '🚪', 'Exit'));
}

function printTodoMenu(user) {
  ui.clear();
  console.log(ui.header('TODO MENU'));
  console.log(ui.line(`${ui.c.gray}   Logged in as ${ui.c.cyan}${user.name}${ui.c.reset}`));
  console.log('');
  console.log(ui.menuItem('1', '➕', 'Add Task'));
  console.log(ui.menuItem('2', '📋', 'View All Tasks'));
  console.log(ui.menuItem('3', '✏️ ', 'Edit Task'));
  console.log(ui.menuItem('4', '🗑️ ', 'Delete Task'));
  console.log(ui.menuItem('5', '🔍', 'Search Tasks'));
  console.log(ui.menuItem('6', '🚪', 'Logout'));
}

// Inner loop shown after a successful login.
async function todoMenu(user) {
  let loggedIn = true;
  while (loggedIn) {
    printTodoMenu(user);
    const choice = await ask(ui.prompt('Enter your choice'));

    switch (choice) {
      case '1':
        await addTask(user.id);
        await pause();
        break;
      case '2':
        await viewTasks(user.id);
        await pause();
        break;
      case '3':
        await editTask(user.id);
        await pause();
        break;
      case '4':
        await deleteTask(user.id);
        await pause();
        break;
      case '5':
        await searchTasks(user.id);
        await pause();
        break;
      case '6':
        loggedIn = false; // Logout -> back to Welcome menu
        break;
      default:
        console.log(ui.error('Invalid choice. Please try again.'));
        await pause();
    }
  }
}

async function main() {
  let running = true;
  while (running) {
    printWelcomeMenu();
    const choice = await ask(ui.prompt('Enter your choice'));

    switch (choice) {
      case '1':
        await register();
        await pause();
        break;
      case '2': {
        const user = await login();
        await pause();
        if (user) await todoMenu(user);
        break;
      }
      case '3':
        running = false;
        console.log(ui.line(`\n${ui.c.cyan}${ui.c.bold}👋 Goodbye!${ui.c.reset}\n`));
        break;
      default:
        console.log(ui.error('Invalid choice. Please try again.'));
        await pause();
    }
  }

  close();
  await pool.end();
}

main().catch((err) => {
  console.error(ui.error(`Unexpected error: ${err.message}`));
  close();
  pool.end();
  process.exit(1);
});
