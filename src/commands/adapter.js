'use strict';

const addDefaultOptions = require('../utils/add-default-options');

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

  addDefaultOptions(yargs);
};

module.exports.handler = async function handler(options) {
  const path = require('path');
  const moveFile = require('../utils/move-file');
  const moveDependentFiles = require('../utils/move-dependent-files');
  const createAppExport = require('../utils/create-app-export');

  const { adapterName, destination, adapterFolder, dryRun } = options;

  const adapterPath = 'app/adapters';
  const packagePath = path.join('.', destination) || 'packages/engines';

  // Moving adapter.js
  const sourceAdapter = adapterFolder
    ? `${adapterPath}/${adapterFolder}/${adapterName}.js`
    : `${adapterPath}/${adapterName}.js`;
  const destAdapter = `${packagePath}/addon/adapters/${adapterName}.js`;

  await moveFile(
    Object.assign(
      {
        fileName: adapterName,
        sourceFile: sourceAdapter,
        destPath: destAdapter,
        fileType: 'Adapter',
      },
      options
    )
  );

  // Moving adapter tests
  const sourceTest = adapterFolder
    ? `tests/unit/adapters/${adapterFolder}/${adapterName}-test.js`
    : `tests/unit/adapters/${adapterName}-test.js`;
  const destTest = `${packagePath}/tests/unit/adapters/${adapterName}-test.js`;

  moveFile(
    Object.assign(
      {
        fileName: adapterName,
        sourceFile: sourceTest,
        destPath: destTest,
        fileType: 'Adapter Test',
      },
      options
    )
  );

  // Create adapter assets to app folder in addon

  createAppExport({
    fileName: adapterName,
    sourceFile: sourceAdapter,
    fileOptions: {
      ext: 'js',
      type: 'adapters',
    },
    dryRun,
    packagePath,
    destination,
    fileType: 'Adapter',
  });

  // Move adapter dependent files that are imported
  await moveDependentFiles(
    Object.assign(
      {
        sourceFile: destAdapter,
        destination,
      },
      options
    )
  );
};
