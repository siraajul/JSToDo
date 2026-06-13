// Task operations (controller layer — delegates SQL to taskModel).
const taskModel = require('./models/taskModel');
const { ask } = require('./input');
const { normalizePriority, isValidDate } = require('./validators');
const ui = require('./ui');

// Use Case 3: Add Task.
async function addTask(userId) {
  console.log(ui.header('ADD TASK'));

  const title = await ask(ui.field('Enter task title'));
  if (!title) {
    console.log(ui.error('Task title cannot be empty.'));
    return;
  }

  const description = await ask(ui.field('Enter task description'));

  const dueDate = await ask(ui.field('Enter due date (YYYY-MM-DD)'));
  if (dueDate && !isValidDate(dueDate)) {
    console.log(ui.error('Invalid date format.'));
    return;
  }

  const priorityInput = await ask(ui.field('Enter priority (Low/Medium/High)'));
  const priority = normalizePriority(priorityInput);
  if (!priority) {
    console.log(ui.error('Priority must be Low, Medium, or High.'));
    return;
  }

  const task = await taskModel.create(userId, { title, description, dueDate, priority });

  console.log(ui.success('Task added successfully!'));
  console.log('');
  console.log(ui.taskFull(task));
}

// Use Case 4: View All Tasks.
async function viewTasks(userId) {
  console.log(ui.header('YOUR TASKS'));

  const tasks = await taskModel.findAllByUser(userId);
  if (tasks.length === 0) {
    console.log(ui.info('No tasks found.'));
    return;
  }

  console.log('');
  tasks.forEach((task) => {
    console.log(ui.taskSummary(task));
    console.log('');
  });
}

// Use Case 5: Edit Task. Empty input keeps the current value.
async function editTask(userId) {
  console.log(ui.header('EDIT TASK'));

  const idInput = await ask(ui.field('Enter task ID to edit'));
  const id = Number(idInput);
  if (!Number.isInteger(id) || id <= 0) {
    console.log(ui.error('Invalid task ID.'));
    return;
  }

  const task = await taskModel.findByIdForUser(id, userId);
  if (!task) {
    console.log(ui.error('Task not found.'));
    return;
  }
  console.log(ui.info('Leave a field blank to keep the current value.'));

  console.log('\n' + ui.current('Current Title', task.title));
  const titleInput = await ask(ui.field('Enter new title'));
  const title = titleInput || task.title;

  console.log('\n' + ui.current('Current Description', task.description));
  const descInput = await ask(ui.field('Enter new description'));
  const description = descInput || task.description;

  console.log('\n' + ui.current('Current Due Date', task.dueDate));
  const dueInput = await ask(ui.field('Enter new due date (YYYY-MM-DD)'));
  let dueDate = task.dueDate;
  if (dueInput) {
    if (!isValidDate(dueInput)) {
      console.log(ui.error('Invalid date format.'));
      return;
    }
    dueDate = dueInput;
  }

  console.log('\n' + ui.current('Current Priority', task.priority));
  const prioInput = await ask(ui.field('Enter new priority (Low/Medium/High)'));
  let priority = task.priority;
  if (prioInput) {
    const normalized = normalizePriority(prioInput);
    if (!normalized) {
      console.log(ui.error('Invalid priority.'));
      return;
    }
    priority = normalized;
  }

  await taskModel.update(id, userId, { title, description, dueDate, priority });

  console.log(ui.success('Task updated successfully!'));
}

// Use Case 6: Delete Task.
async function deleteTask(userId) {
  console.log(ui.header('DELETE TASK'));

  const idInput = await ask(ui.field('Enter task ID to delete'));
  const id = Number(idInput);
  if (!Number.isInteger(id) || id <= 0) {
    console.log(ui.error('Invalid task ID.'));
    return;
  }

  const task = await taskModel.findByIdForUser(id, userId);
  if (!task) {
    console.log(ui.error('Task not found.'));
    return;
  }

  console.log('\n' + ui.taskSummary(task));
  const confirm = await ask(ui.field('Are you sure you want to delete this task? (yes/no)'));
  if (confirm.toLowerCase() !== 'yes') {
    console.log(ui.info('Delete cancelled.'));
    return;
  }

  await taskModel.remove(id, userId);
  console.log(ui.success('Task deleted successfully!'));
}

// Use Case 7: Search Tasks by title or description.
async function searchTasks(userId) {
  console.log(ui.header('SEARCH TASKS'));

  const keyword = await ask(ui.field('Enter search keyword'));
  const tasks = await taskModel.search(userId, keyword);

  if (tasks.length === 0) {
    console.log(ui.info('No matching tasks found.'));
    return;
  }

  console.log('');
  tasks.forEach((task) => {
    console.log(ui.taskSummary(task));
    console.log('');
  });
}

module.exports = { addTask, viewTasks, editTask, deleteTask, searchTasks };
