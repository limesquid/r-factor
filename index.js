const getStdin = require('get-stdin');
const argv = require('./cli');
const settings = require('./src/settings');
const refactorings = require('./src/refactorings');
const { verifyLicense } = require('./src/utils/license');

settings.set(JSON.parse(argv.settings));
const refactoring = new refactorings[argv.refactoring]();

getStdin().then((data) => {
  try {
    if (!verifyLicense(argv.license)) {
      throw 'Invalid license';
    }
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
