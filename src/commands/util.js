'use strict';

const AddDefaultOptions = require('../utils/add-default-options');

module.exports.command = 'util [util-name] [destination]';

module.exports.desc = 'Copy a util from app to addon';

module.exports.builder = function builder(yargs) {
  yargs.positional('util-name', {
    describe: 'The name of the util to copy',
  });
  yargs.positional('destination', {
    describe: 'The relative path of the addon folder to copy to',
  });

  yargs.option('util-folder', {
    alias: 'f',
    demandOption: false,
    describe: 'The name of the util folder if it is namespaced within app/utils',
    type: 'string',
  });

  AddDefaultOptions(yargs);
};

module.exports.handler = async function handler(options) {
  const path = require('path');
  const MoveFile = require('../utils/move-file');
  const CreateAppExport = require('../utils/create-app-export');

  const utilPath = 'app/utils';
  const { utilName, destination, utilFolder, dryRun, deleteSource } = options;
  const packagePath = path.join('.', destination) || 'packages/engines';

  // Moving util.js
  const sourceutil = utilFolder
    ? `${utilPath}/${utilFolder}/${utilName}.js`
    : `${utilPath}/${utilName}.js`;
  const destutil = `${packagePath}/addon/utils/${utilName}.js`;

  MoveFile({
    deleteSource,
    fileName: utilName,
    sourceFile: sourceutil,
    destPath: destutil,
    fileType: 'Util',
    dryRun
  });

  // Moving util tests
  const sourceTest = utilFolder
    ? `tests/unit/utils/${utilFolder}/${utilName}-test.js`
    : `tests/unit/utils/${utilName}-test.js`;
  const destTest = `${packagePath}/tests/unit/utils/${utilName}-test.js`;

  MoveFile({
    deleteSource,
    fileName: utilName,
    sourceFile: sourceTest,
    destPath: destTest,
    fileType: 'Util Test',
    dryRun
  });

  // Create util assets to app folder in addon

  CreateAppExport({
    fileName: utilName,
    fileOptions: {
      ext: 'js',
      type: 'utils'
    },
    dryRun,
    packagePath,
    destination,
    fileType: 'Util'
  });
};
