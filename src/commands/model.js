'use strict';

const addDefaultOptions = require('../utils/add-default-options');

module.exports.command = 'model [model-name] [destination]';

module.exports.desc = 'Copy a model from app to addon';

module.exports.builder = function builder(yargs) {
  yargs.positional('model-name', {
    describe: 'The name of the model to copy',
  });
  yargs.positional('destination', {
    describe: 'The relative path of the addon folder to copy to',
  });

  yargs.option('model-folder', {
    alias: 'f',
    demandOption: false,
    describe: 'The name of the model folder if it is namespaced within app/helpers',
    type: 'string',
  });

  addDefaultOptions(yargs);
};

module.exports.handler = async function handler(options) {
  const path = require('path');
  const moveFile = require('../utils/move-file');
  const createAppExport = require('../utils/create-app-export');

  const modelPath = 'app/models';

  const { modelName, destination, modelFolder, dryRun } = options;
  const packagePath = path.join('.', destination) || 'packages/engines';

  // Moving model.js
  const sourcemodel = modelFolder
    ? `${modelPath}/${modelFolder}/${modelName}.js`
    : `${modelPath}/${modelName}.js`;
  const destmodel = `${packagePath}/addon/models/${modelName}.js`;

  moveFile(
    Object.assign(
      {
        fileName: modelName,
        sourceFile: sourcemodel,
        destPath: destmodel,
        fileType: 'Model',
      },
      options
    )
  );

  // Moving model tests
  const sourceTest = modelFolder
    ? `tests/unit/models/${modelFolder}/${modelName}-test.js`
    : `tests/unit/models/${modelName}-test.js`;
  const destTest = `${packagePath}/tests/unit/models/${modelName}-test.js`;

  moveFile(
    Object.assign(
      {
        fileName: modelName,
        sourceFile: sourceTest,
        destPath: destTest,
        fileType: 'Model Test',
      },
      options
    )
  );

  // Create model assets to app folder in addon
  createAppExport({
    fileName: modelName,
    fileOptions: {
      ext: 'js',
      type: 'models',
    },
    dryRun,
    packagePath,
    destination,
    fileType: 'Model',
  });
};
