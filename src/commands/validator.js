'use strict';

const addDefaultOptions = require('../utils/add-default-options');

module.exports.command = 'validator [validator-name] [destination]';

module.exports.desc = 'Copy a validator from app to addon';

module.exports.builder = function builder(yargs) {
  yargs.positional('validator-name', {
    describe: 'The name of the validator to copy',
  });
  yargs.positional('destination', {
    describe: 'The relative path of the addon folder to copy to',
  });

  yargs.option('validator-folder', {
    alias: 'f',
    demandOption: false,
    describe: 'The name of the validator folder if it is namespaced within app/validators',
    type: 'string',
  });

  addDefaultOptions(yargs);
};

module.exports.handler = async function handler(options) {
  const path = require('path');
  const moveFile = require('../utils/move-file');
  const createAppExport = require('../utils/create-app-export');

  const { validatorName, destination, validatorFolder, dryRun } = options;

  const validatorPath = 'app/validators';
  const packagePath = path.join('.', destination) || 'packages/engines';

  // Moving validator.js
  const sourcevalidator = validatorFolder
    ? `${validatorPath}/${validatorFolder}/${validatorName}.js`
    : `${validatorPath}/${validatorName}.js`;
  const destvalidator = `${packagePath}/addon/validators/${validatorName}.js`;

  moveFile(
    Object.assign(
      {
        fileName: validatorName,
        sourceFile: sourcevalidator,
        destPath: destvalidator,
        fileType: 'Validator',
      },
      options
    )
  );

  // Moving validator tests
  const sourceTest = validatorFolder
    ? `tests/unit/validators/${validatorFolder}/${validatorName}-test.js`
    : `tests/unit/validators/${validatorName}-test.js`;
  const destTest = `${packagePath}/tests/unit/validators/${validatorName}-test.js`;

  moveFile(
    Object.assign(
      {
        fileName: validatorName,
        sourceFile: sourceTest,
        destPath: destTest,
        fileType: 'Validator Test',
      },
      options
    )
  );

  // Create validator assets to app folder in addon
  createAppExport({
    fileName: validatorName,
    fileOptions: {
      ext: 'js',
      type: 'validators',
    },
    dryRun,
    packagePath,
    destination,
    fileType: 'Validator',
  });
};
