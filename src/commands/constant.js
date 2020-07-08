'use strict';

const addDefaultOptions = require('../utils/add-default-options');

module.exports.command = 'constant [constant-name] [destination]';

module.exports.desc = 'Copy a constant from app to addon';

module.exports.builder = function builder(yargs) {
  yargs.positional('constant-name', {
    describe: 'The name of the constant to copy',
  });

  yargs.positional('destination', {
    describe: 'The relative path of the addon folder to copy to',
  });

  yargs.option('constant-folder', {
    alias: 'f',
    demandOption: false,
    describe: 'The name of the constant folder if it is namespaced within app/helpers',
    type: 'string',
  });

  addDefaultOptions(yargs);
};

module.exports.handler = async function handler(options) {
  const path = require('path');
  const moveFile = require('../utils/move-file');
  const moveDependentFiles = require('../utils/move-dependent-files');
  const createAppExport = require('../utils/create-app-export');

  const constantPath = 'app/constants';

  const { constantName, destination, constantFolder, dryRun } = options;

  const packagePath = path.join('.', destination) || 'packages/engines';

  // Moving constant.js
  const sourceConstant = constantFolder
    ? `${constantPath}/${constantFolder}/${constantName}.js`
    : `${constantPath}/${constantName}.js`;
  const destConstant = `${packagePath}/addon/constants/${constantName}.js`;

  await moveFile(
    Object.assign(
      {
        fileName: constantName,
        sourceFile: sourceConstant,
        destPath: destConstant,
        fileType: 'Constant',
      },
      options
    )
  );
  // Create constant assets to app folder in addon

  createAppExport({
    fileName: constantName,
    sourceFile: sourceConstant,
    fileOptions: {
      ext: 'js',
      type: 'constants',
    },
    dryRun,
    packagePath,
    destination,
    fileType: 'Constant',
  });

  // Move constant dependent files that are imported
  await moveDependentFiles(
    Object.assign(
      {
        sourceFile: destConstant,
        destination,
      },
      options
    )
  );
};
