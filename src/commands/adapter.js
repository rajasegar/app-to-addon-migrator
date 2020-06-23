'use strict';

const AddDefaultOptions = require('../utils/add-default-options');

module.exports.command = 'adapter [adapter-name] [destination]';
module.exports.desc = 'Copy an adapter from app to addon';

module.exports.builder = function builder(yargs) {
  yargs.positional('adapter-name', {
    describe: 'The name of the adapter to copy',
  });
  yargs.positional('destination', {
    describe: 'The relative path of the addon folder to copy to',
  });

  yargs.option('adapter-folder', {
    alias: 'f',
    demandOption: false,
    describe: 'The name of the helper folder if it is namespaced within app/helpers',
    type: 'string',
  });

  AddDefaultOptions(yargs);
};

module.exports.handler = async function handler(options) {
  const path = require('path');
  const MoveFile = require('../utils/move-file');
  const CreateAppExport = require('../utils/create-app-export');

  const { adapterName, destination, adapterFolder, dryRun, deleteSource, modulePrefix } = options;

  const adapterPath = 'app/adapters';
  const packagePath = path.join('.', destination) || 'packages/engines';

  // Moving adapter.js
  const sourceadapter = adapterFolder
    ? `${adapterPath}/${adapterFolder}/${adapterName}.js`
    : `${adapterPath}/${adapterName}.js`;
  const destadapter = `${packagePath}/addon/adapters/${adapterName}.js`;

  MoveFile({
    deleteSource,
    fileName: adapterName,
    sourceFile: sourceadapter,
    destPath: destadapter,
    fileType: 'Adapter',
    dryRun
  });

  // Moving adapter tests
  const sourceTest = adapterFolder
    ? `tests/unit/adapters/${adapterFolder}/${adapterName}-test.js`
    : `tests/unit/adapters/${adapterName}-test.js`;
  const destTest = `${packagePath}/tests/unit/adapters/${adapterName}-test.js`;

  MoveFile({
    deleteSource,
    fileName: adapterName,
    sourceFile: sourceTest,
    destPath: destTest,
    fileType: 'Adapter Test',
    dryRun
  });

  // Create adapter assets to app folder in addon

  CreateAppExport({
    fileName: adapterName,
    fileOptions: {
      ext: 'js',
      type: 'adapters'
    },
    dryRun,
    packagePath,
    destination,
    modulePrefix,
    fileType: 'Adapter'
  });
};
