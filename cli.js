const getStdin = require('get-stdin');
const argv = require('./cli-argv');
const rFactor = require('./index');

getStdin().then((code) => {
  try {
    process.stdout.write(rFactor({
      code,
      refactoring: argv.refactoring,
      settings: JSON.parse(argv.settings)
    }));
  } catch (error) {
    process.stderr.write(error);
  }
});
