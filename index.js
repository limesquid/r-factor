const readline = require('readline');
const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const input = [];

readlineInterface.on('pause', () => {
  console.log(input.join('\n'));
});

readlineInterface.on('line', (line) => {
  input.push(line);
});
