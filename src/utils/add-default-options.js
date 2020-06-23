'use strict';

module.exports = function (yargs) {
  yargs.option('delete-source', {
    alias: 'ds',
    demandOption: false,
    describe: 'Delete source files',
    type: 'boolean',
    default: false
  });

  yargs.option('module-prefix', {
    alias: 'mp',
    demandOption: false,
    describe: 'Specify module-prefix if your addon name is different from its path',
    type: 'string'
  });
};
