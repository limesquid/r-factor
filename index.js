const readline = require('readline');
const argv = require('./cli');

const refactorings = {
  'convert-to-component': require('./src/convert-to-component'),
  'convert-to-functional-component': require('./src/convert-to-functional-component')
};

const refactoring = new refactorings[argv.refactoring]();

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

const run = () => readInput()
  // .then((input) => refactoring.canApply(input) ? refactoring.refactor(input) : input)
  .then((input) => refactoring.refactor(input))
  .then((output) => console.log(output));

run();
