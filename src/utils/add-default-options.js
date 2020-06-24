'use strict';

module.exports = function (yargs) {
  yargs.option('delete-source', {
    alias: 'ds',
    demandOption: false,
    describe: 'Delete source files',
    type: 'boolean',
    default: false,
  });
};
