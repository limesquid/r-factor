const readline = require('readline');
const { canRefactor, refactor } = require('./src');

const readInput = () => new Promise((resolve) => {
  const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  const input = [];

  readlineInterface.on('pause', () => {
    const lines = input.join('\n');
    resolve(lines);
  });

  readlineInterface.on('line', (line) => {
    input.push(line);
  });
});

const writeOutput = (output) => console.log(output);

const run = () => readInput()
  .then((input) => canRefactor(input) ? refactor(input) :input)
  .then(writeOutput);

run();
