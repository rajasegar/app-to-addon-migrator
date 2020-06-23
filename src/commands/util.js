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
  const fs = require('fs');
  const fse = require('fs-extra');
  const path = require('path');
  const { log, error, ok, warning } = require('../utils/logging');

  const utilPath = 'app/utils';
  const { utilName, destination, utilFolder, dryRun } = options;
  const packagePath = path.join('.', destination) || 'packages/engines';

  // Moving util.js
  log('Moving util.js');
  log('---------------');
  const sourceutil = utilFolder
    ? `${utilPath}/${utilFolder}/${utilName}.js`
    : `${utilPath}/${utilName}.js`;
  const destutil = `${packagePath}/addon/utils/${utilName}.js`;

  log(sourceutil);
  log(destutil);

  if (!dryRun) {
    fse
      .copy(sourceutil, destutil)
      .then(() => {
        ok(`Success: util ${utilName}.js copied`);
      })
      .catch((err) => error(err));
  }

  // Moving util tests
  log('\nMoving util tests');
  log('------------------');
  const sourceTest = utilFolder
    ? `tests/unit/utils/${utilFolder}/${utilName}-test.js`
    : `tests/unit/utils/${utilName}-test.js`;
  const destTest = `${packagePath}/tests/unit/utils/${utilName}-test.js`;

  log(sourceTest);
  log(destTest);
  if (!dryRun) {
    if (fs.existsSync(sourceTest)) {
      fse
        .copy(sourceTest, destTest)
        .then(() => {
          ok(`Success: util Test ${utilName}.hbs copied`);
        })
        .catch((err) => error(err));
    } else {
      warning(`WARNING: There are no unit tests for util ${utilName}`);
    }
  }

  // Create util assets to app folder in addon

  log('\nCreating util assets in app folder ');
  log('----------------------------------- ');

  const apputil = `${packagePath}/app/utils/${utilName}.js`;
  const addonName = path.basename(destination);
  const utilBody = `export { default } from '${addonName}/utils/${utilName}';`;
  log(apputil);
  if (!dryRun) {
    fse
      .outputFile(apputil, utilBody)
      .then(() => {
        ok(`Success: util ${utilName}.js created in app`);
      })
      .catch((err) => {
        console.error(err);
      });
  }
};
