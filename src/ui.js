// Terminal styling helpers — colors, boxes, cards. No external dependencies.

const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
};

const BOX_WIDTH = 46;        // inner width of the header box
const BLOCK_WIDTH = BOX_WIDTH + 2; // box including borders

// Left margin needed to center a BLOCK_WIDTH-wide block in the terminal.
function leftMargin() {
  const cols = process.stdout.columns || 80;
  return Math.max(0, Math.floor((cols - BLOCK_WIDTH) / 2));
}

// Prefix every non-empty line of a block with the centering margin so the
// whole UI sits as one centered column (internal alignment preserved).
function indent(block) {
  const margin = ' '.repeat(leftMargin());
  return block
    .split('\n')
    .map((line) => (line === '' ? '' : margin + line))
    .join('\n');
}

// Clear the screen (and scrollback) for a clean frame.
function clear() {
  process.stdout.write('\x1b[2J\x1b[3J\x1b[H');
}

// Centered, boxed title in cyan.
function header(title) {
  const top = '╔' + '═'.repeat(BOX_WIDTH) + '╗';
  const bottom = '╚' + '═'.repeat(BOX_WIDTH) + '╝';
  const pad = BOX_WIDTH - title.length;
  const left = Math.floor(pad / 2);
  const right = pad - left;
  const middle = '║' + ' '.repeat(left) + title + ' '.repeat(right) + '║';
  return indent(`${c.cyan}${c.bold}${top}\n${middle}\n${bottom}${c.reset}`);
}

// A numbered menu row with an icon.
function menuItem(num, icon, label) {
  return indent(`   ${c.bold}${c.yellow}${num}${c.reset}  ${icon}  ${c.white}${label}${c.reset}`);
}

// A plain centered line of text.
function line(text) {
  return indent(text);
}

// Inline prompt (cursor stays on the same line).
function prompt(label) {
  return indent(`\n${c.bold}${c.cyan}❯ ${label}: ${c.reset}`);
}

// Field prompt: label on one line, arrow on the next.
function field(label) {
  return indent(`\n${c.cyan}${label}${c.reset}\n${c.gray}  ❯ ${c.reset}`);
}

// Shows the current value when editing.
function current(label, value) {
  return indent(`${c.dim}  ${label}: ${value || '(empty)'}${c.reset}`);
}

function success(msg) {
  return indent(`\n${c.green}${c.bold}✓ ${msg}${c.reset}`);
}

function error(msg) {
  return indent(`\n${c.red}${c.bold}✗ ${msg}${c.reset}`);
}

function info(msg) {
  return indent(`\n${c.cyan}ℹ ${msg}${c.reset}`);
}

function pausePrompt() {
  return indent(`\n${c.gray}  Press Enter to continue...${c.reset}`);
}

// Colored priority tag with a dot icon.
function priorityTag(priority) {
  const colors = { High: c.red, Medium: c.yellow, Low: c.green };
  const dots = { High: '🔴', Medium: '🟡', Low: '🟢' };
  const col = colors[priority] || c.white;
  const dot = dots[priority] || '•';
  return `${col}${dot} ${priority}${c.reset}`;
}

// Colored status tag.
function statusTag(status) {
  return status === 'Completed'
    ? `${c.green}✅ ${status}${c.reset}`
    : `${c.yellow}⏳ ${status}${c.reset}`;
}

const barColors = { High: c.red, Medium: c.yellow, Low: c.green };

// Compact task card (for lists & search) with a priority-colored side bar.
function taskSummary(task) {
  const bar = (barColors[task.priority] || c.cyan) + '┃' + c.reset;
  return indent([
    `${bar} ${c.bold}#${task.id}${c.reset}  ${c.white}${task.title}${c.reset}`,
    `${bar} ${c.gray}📅 ${task.dueDate || '—'}${c.reset}   ${priorityTag(task.priority)}   ${statusTag(task.status)}`,
  ].join('\n'));
}

// Full task card (after add) including description.
function taskFull(task) {
  const bar = (barColors[task.priority] || c.cyan) + '┃' + c.reset;
  return indent([
    `${bar} ${c.bold}Task #${task.id}${c.reset}`,
    `${bar} ${c.white}${task.title}${c.reset}`,
    `${bar} ${c.gray}${task.description || '(no description)'}${c.reset}`,
    `${bar} ${c.gray}📅 ${task.dueDate || '—'}${c.reset}   ${priorityTag(task.priority)}   ${statusTag(task.status)}`,
  ].join('\n'));
}

function divider() {
  return indent(`${c.gray}${'─'.repeat(BOX_WIDTH)}${c.reset}`);
}

module.exports = {
  c,
  clear,
  indent,
  header,
  menuItem,
  line,
  prompt,
  field,
  current,
  success,
  error,
  info,
  pausePrompt,
  priorityTag,
  statusTag,
  taskSummary,
  taskFull,
  divider,
};
