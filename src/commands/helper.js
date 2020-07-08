'use strict';

const addDefaultOptions = require('../utils/add-default-options');

module.exports.command = 'helper [helper-name] [destination]';

module.exports.desc = 'Copy a helper from app to addon';

module.exports.builder = function builder(yargs) {
  yargs.positional('helper-name', {
    describe: 'The name of the helper to copy',
  });
  yargs.positional('destination', {
    describe: 'The relative path of the addon folder to copy to',
  });

  yargs.option('helper-folder', {
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

  const helperPath = 'app/helpers';
  const { helperName, destination, helperFolder, dryRun } = options;
  const packagePath = path.join('.', destination) || 'packages/engines';

  // Moving helper.js
  const sourceHelper = helperFolder
    ? `${helperPath}/${helperFolder}/${helperName}.js`
    : `${helperPath}/${helperName}.js`;
  const destHelper = `${packagePath}/addon/helpers/${helperName}.js`;

  await moveFile(
    Object.assign(
      {
        fileName: helperName,
        sourceFile: sourceHelper,
        destPath: destHelper,
        fileType: 'Helper',
      },
      options
    )
  );

  // Moving helper tests
  const sourceTest = helperFolder
    ? `tests/unit/helpers/${helperFolder}/${helperName}-test.js`
    : `tests/unit/helpers/${helperName}-test.js`;
  const destTest = `${packagePath}/tests/unit/helpers/${helperName}-test.js`;

  moveFile(
    Object.assign(
      {
        fileName: helperName,
        sourceFile: sourceTest,
        destPath: destTest,
        fileType: 'Helper Test',
      },
      options
    )
  );

  // Create helper assets to app folder in addon
  createAppExport({
    fileName: helperName,
    sourceFile: sourceHelper,
    fileOptions: {
      ext: 'js',
      type: 'helpers',
    },
    dryRun,
    packagePath,
    destination,
    fileType: 'Helper',
  });

  // Move helper dependent files that are imported
  await moveDependentFiles(
    Object.assign(
      {
        sourceFile: destHelper,
        destination,
      },
      options
    )
  );
};
