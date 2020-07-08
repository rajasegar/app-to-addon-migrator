'use strict';

const addDefaultOptions = require('../utils/add-default-options');

module.exports.command = 'mixin [mixin-name] [destination]';

module.exports.desc = 'Copy a mixin from app to addon';

module.exports.builder = function builder(yargs) {
  yargs.positional('mixin-name', {
    describe: 'The name of the mixin to copy',
  });
  yargs.positional('destination', {
    describe: 'The relative path of the addon folder to copy to',
  });

  yargs.option('mixin-folder', {
    alias: 'f',
    demandOption: false,
    describe: 'The name of the mixin folder if it is namespaced within app/helpers',
    type: 'string',
  });

  addDefaultOptions(yargs);
};

module.exports.handler = async function handler(options) {
  const path = require('path');
  const moveFile = require('../utils/move-file');
  const moveDependentFiles = require('../utils/move-dependent-files');
  const createAppExport = require('../utils/create-app-export');

  const mixinPath = 'app/mixins';
  const { mixinFolder, mixinName, destination, dryRun } = options;
  const packagePath = path.join('.', destination) || 'packages/engines';

  // Moving mixin.js
  const sourceMixin = mixinFolder
    ? `${mixinPath}/${mixinFolder}/${mixinName}.js`
    : `${mixinPath}/${mixinName}.js`;
  const destMixin = `${packagePath}/addon/mixins/${mixinName}.js`;

  await moveFile(
    Object.assign(
      {
        fileName: mixinName,
        sourceFile: sourceMixin,
        destPath: destMixin,
        fileType: 'Mixin',
      },
      options
    )
  );

  // Moving mixin tests
  const sourceTest = mixinFolder
    ? `tests/unit/mixins/${mixinFolder}/${mixinName}-test.js`
    : `tests/unit/mixins/${mixinName}-test.js`;
  const destTest = `${packagePath}/tests/unit/mixins/${mixinName}-test.js`;

  moveFile(
    Object.assign(
      {
        fileName: mixinName,
        sourceFile: sourceTest,
        destPath: destTest,
        fileType: 'Mixin Test',
      },
      options
    )
  );

  // Create constant assets to app folder in addon

  createAppExport({
    fileName: mixinName,
    sourceFile: sourceMixin,
    fileOptions: {
      ext: 'js',
      type: 'mixins',
    },
    dryRun,
    packagePath,
    destination,
    fileType: 'Mixin',
  });

  // Move mixin dependent files that are imported
  await moveDependentFiles(
    Object.assign(
      {
        sourceFile: destMixin,
        destination,
      },
      options
    )
  );
};
