const getStdin = require('get-stdin');
const argv = require('./cli');
const settings = require('./src/settings');

// const getModuleName = (key) => /(.*)\/index.js$/.match(key)[1];
// const context = require.context('./src/refactorings', true, /^[^/]+\/index\.js$/);
// console.log(context.keys());
// const refactorings = context.keys().reduce(
//   (modules, key) => ({ ...modules, [getModuleName(key)]: context(key) }),
//   {}
// );

const refactorings = {
  'add-classname': require('./src/refactorings/add-classname'),
  'connect': require('./src/refactorings/connect'),
  'connect-map-state-to-props': require('./src/refactorings/connect-map-state-to-props'),
  'connect-map-dispatch-to-props': require('./src/refactorings/connect-map-dispatch-to-props'),
  'connect-merge-props': require('./src/refactorings/connect-merge-props'),
  'convert-to-class': require('./src/refactorings/convert-to-class'),
  'convert-to-arrow': require('./src/refactorings/convert-to-arrow'),
  'convert-to-function': require('./src/refactorings/convert-to-function'),
  'disconnect': require('./src/refactorings/disconnect'),
  'disconnect-map-state-to-props': require('./src/refactorings/disconnect-map-state-to-props'),
  'disconnect-map-dispatch-to-props': require('./src/refactorings/disconnect-map-dispatch-to-props'),
  'disconnect-merge-props': require('./src/refactorings/disconnect-merge-props'),
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
