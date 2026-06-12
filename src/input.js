// Promise-based console input so the whole app can use async/await.
// Lines are queued so it works for both interactive typing and piped input
// (piped stdin emits all lines in a burst, which rl.question would drop).
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

const lineQueue = [];   // lines received but not yet consumed
const waiters = [];      // pending ask() resolvers waiting for a line
let closed = false;

rl.on('line', (line) => {
  if (waiters.length) {
    waiters.shift()(line);
  } else {
    lineQueue.push(line);
  }
});

rl.on('close', () => {
  closed = true;
  while (waiters.length) waiters.shift()(null);
});

// Ask a question and resolve with the trimmed answer.
function ask(question) {
  process.stdout.write(question);
  return new Promise((resolve) => {
    if (lineQueue.length) {
      resolve(lineQueue.shift().trim());
    } else if (closed) {
      resolve('');
    } else {
      waiters.push((line) => resolve(line === null ? '' : line.trim()));
    }
  });
}

function close() {
  rl.close();
}

module.exports = { ask, close };
