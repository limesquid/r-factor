const getStdin = require('get-stdin');
const argv = require('./cli');

const refactorings = {
  'convert-to-component': require('./src/convert-to-component'),
  'convert-to-functional-component': require('./src/convert-to-functional-component')
};

const refactoring = new refactorings[argv.refactoring]();

getStdin().then((data) => {
  try {
    const code = refactoring.refactor(data);
    process.stdout.write(code);
  } catch (error) {
    process.stderr.write(error);
  }
});
