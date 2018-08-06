const yargs = require('yargs');

const { argv } = yargs
  .usage('$0 --refactoring=[string] --settings=[string]')
  .option('refactoring', {
    alias: 'r',
    demandOption: true,
    describe: 'Refactoring name',
    type: 'string'
  })
  .option('license', {
    alias: 'l',
    demandOption: true,
    describe: 'License key',
    type: 'string'
  })
  .option('settings', {
    alias: 's',
    demandOption: true,
    describe: 'Settings',
    type: 'string'
  })
  .alias('v', 'version')
  .version()
  .help();

module.exports = argv;
