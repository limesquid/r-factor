const getStdin = require('get-stdin');
const argv = require('./cli');
const settings = require('./src/settings');

const refactorings = {
  'add-classname': require('./src/refactorings/add-classname'),
  'connect-component': require('./src/refactorings/connect-component'),
  'connect-component-with-state': require('./src/refactorings/connect-component-with-state'),
  'connect-component-with-dispatch': require('./src/refactorings/connect-component-with-dispatch'),
  'connect-component-with-merge-props': require('./src/refactorings/connect-component-with-merge-props'),
  'convert-to-class-component': require('./src/refactorings/convert-to-class-component'),
  'convert-to-arrow-component': require('./src/refactorings/convert-to-arrow-component'),
  'convert-to-function-component': require('./src/refactorings/convert-to-function-component'),
  'generate-prop-types': require('./src/refactorings/generate-prop-types'),
  'move-default-props-out-of-class': require('./src/refactorings/move-default-props-out-of-class'),
  'move-default-props-to-class': require('./src/refactorings/move-default-props-to-class'),
  'move-prop-types-out-of-class': require('./src/refactorings/move-prop-types-out-of-class'),
  'move-prop-types-to-class': require('./src/refactorings/move-prop-types-to-class'),
  'sort-attributes': require('./src/refactorings/sort-attributes'),
  'sort-imports': require('./src/refactorings/sort-imports'),
  'toggle-component-type': require('./src/refactorings/toggle-component-type'),
  'toggle-with-router-hoc': require('./src/refactorings/toggle-with-router-hoc')
};
settings.set(JSON.parse(argv.settings));
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
