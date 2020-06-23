'use strict';

module.exports.command = 'component [component-name] [destination]';

module.exports.desc = 'Copy a component from app to addon';

module.exports.builder = function builder(yargs) {
  yargs.positional('component-name', {
    describe: 'The name of the component to copy',
  });

  yargs.positional('destination', {
    describe: 'The relative path of the addon folder to copy to',
  });

  yargs.option('component-folder', {
    alias: 'f',
    demandOption: false,
    describe: 'The name of the component folder if it is namespaced within app/helpers',
    type: 'string',
  });

  yargs.option('delete-source', {
    alias: 'ds',
    demandOption: true,
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

module.exports.handler = async function handler(options) {
  const copyComponent = require('../utils/copy-component');

  copyComponent(options);
};
