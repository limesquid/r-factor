const getStdin = require('get-stdin');
const argv = require('./cli');

const refactorings = {
  'convert-to-component': require('./src/refactorings/convert-to-component'),
  'convert-to-functional-component': require('./src/refactorings/convert-to-functional-component'),
  'generate-prop-types': require('./src/refactorings/generate-prop-types'),
  'move-default-props-out-of-class': require('./src/refactorings/move-default-props-out-of-class'),
  'move-default-props-to-class': require('./src/refactorings/move-default-props-to-class'),
  'move-prop-types-out-of-class': require('./src/refactorings/move-prop-types-out-of-class'),
  'move-prop-types-to-class': require('./src/refactorings/move-prop-types-to-class')
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
