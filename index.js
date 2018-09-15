const getStdin = require('get-stdin');
const argv = require('./cli');
const rfactor = require('./r-factor');

getStdin().then((code) => {
  try {
    process.stdout.write(rfactor({
      code,
      license: argv.license,
      refactoring: argv.refactoring,
      settings: JSON.parse(argv.settings)
    }));
  } catch (error) {
    process.stderr.write(error);
  }
});
