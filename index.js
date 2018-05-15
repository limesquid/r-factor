const getStdin = require('get-stdin');
const argv = require('./cli');

const refactorings = {
  'convert-to-component': require('./src/convert-to-component'),
  'convert-to-functional-component': require('./src/convert-to-functional-component'),
  'move-default-props-out-of-class': require('./src/move-default-props-out-of-class'),
  'move-default-props-to-class': require('./src/move-default-props-to-class'),
  'move-prop-types-out-of-class': require('./src/move-prop-types-out-of-class'),
  'move-prop-types-to-class': require('./src/move-prop-types-to-class')
};

const refactoring = new refactorings[argv.refactoring]();

getStdin().then((data) => {
  try {
    if (refactoring.canApply(data)) {
      const code = refactoring.refactor(data);
      process.stdout.write(code);
    } else {
      process.stdout.write(data);
    }
  } catch (error) {
    process.stderr.write(error);
  }
});
