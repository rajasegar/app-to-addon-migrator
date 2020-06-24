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
  const MoveFile = require('../utils/move-file');

  const mixinPath = 'app/mixins';
  const { mixinFolder, mixinName, destination, dryRun, deleteSource } = options;
  const packagePath = path.join('.', destination) || 'packages/engines';

  // Moving mixin.js
  const sourcemixin = mixinFolder
    ? `${mixinPath}/${mixinFolder}/${mixinName}.js`
    : `${mixinPath}/${mixinName}.js`;
  const destmixin = `${packagePath}/addon/mixins/${mixinName}.js`;

  MoveFile({
    deleteSource,
    fileName: mixinName,
    sourceFile: sourcemixin,
    destPath: destmixin,
    fileType: 'Mixin',
    dryRun
  });

  // Moving mixin tests
  const sourceTest = mixinFolder
    ? `tests/unit/mixins/${mixinFolder}/${mixinName}-test.js`
    : `tests/unit/mixins/${mixinName}-test.js`;
  const destTest = `${packagePath}/tests/unit/mixins/${mixinName}-test.js`;

  MoveFile({
    deleteSource,
    fileName: mixinName,
    sourceFile: sourceTest,
    destPath: destTest,
    fileType: 'Mixin Test',
    dryRun
  });
};
