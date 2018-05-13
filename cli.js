const yargs = require('yargs');

const { argv } = yargs
  .usage('$0 --refactoring=[string]')
  .option('refactoring', {
    alias: 'r',
    demandOption: true,
    describe: 'Refactoring name',
    type: 'string'
  })
  .alias('v', 'version')
  .version()
  .help();

module.exports = argv;
