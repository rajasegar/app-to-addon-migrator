'use strict';

module.exports = function (yargs) {
  yargs.option('delete-source', {
    alias: 'ds',
    demandOption: false,
    describe: 'Delete source files',
    type: 'boolean',
    default: false,
  });

  yargs.option('skip-tests', {
    alias: 'ktih',
    demandOption: false,
    describe: 'Keeps the tests in host app under the addon name',
    type: 'boolean',
    default: false,
  });
};
