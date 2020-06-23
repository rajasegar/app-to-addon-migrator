'use strict';

const AddDefaultOptions = require('../utils/add-default-options');

module.exports.command = 'service [service-name] [destination]';
module.exports.desc = 'Copy a service from app to addon';

module.exports.builder = function builder(yargs) {
  yargs.positional('service-name', {
    describe: 'The name of the service to copy',
  });
  yargs.positional('destination', {
    describe: 'The relative path of the addon folder to copy to',
  });

  yargs.option('service-folder', {
    alias: 'f',
    demandOption: false,
    describe: 'The name of the helper folder if it is namespaced within app/helpers',
    type: 'string',
  });

  AddDefaultOptions(yargs);
};

module.exports.handler = async function handler(options) {
  const fs = require('fs');
  const fse = require('fs-extra');
  const path = require('path');
  const { log, error, ok, warning } = require('../utils/logging');

  const { serviceName, destination, serviceFolder, dryRun } = options;
  log(serviceFolder);

  const servicePath = 'app/services';
  const packagePath = path.join('.', destination) || 'packages/engines';

  // Moving service.js
  log('Moving service.js');
  log('---------------');
  const sourceservice = serviceFolder
    ? `${servicePath}/${serviceFolder}/${serviceName}.js`
    : `${servicePath}/${serviceName}.js`;
  const destservice = `${packagePath}/addon/services/${serviceName}.js`;

  log(sourceservice);
  log(destservice);

  if (!dryRun) {
    fse
      .copy(sourceservice, destservice)
      .then(() => {
        ok(`Success: Service ${serviceName}.js copied`);
      })
      .catch((err) => error(err));
  }

  // Moving service tests
  log('\nMoving service tests');
  log('------------------');
  const sourceTest = serviceFolder
    ? `tests/unit/services/${serviceFolder}/${serviceName}-test.js`
    : `tests/unit/services/${serviceName}-test.js`;
  const destTest = `${packagePath}/tests/unit/services/${serviceName}-test.js`;

  log(sourceTest);
  log(destTest);
  if (!dryRun) {
    if (fs.existsSync(sourceTest)) {
      fse
        .copy(sourceTest, destTest)
        .then(() => {
          ok(`Success: Service Test ${serviceName}.hbs copied`);
        })
        .catch((err) => error(err));
    } else {
      warning(`WARNING: There are no unit tests for service ${serviceName}`);
    }
  }

  // Create service assets to app folder in addon

  log('\nCreating service assets in app folder ');
  log('----------------------------------- ');

  const appservice = `${packagePath}/app/services/${serviceName}.js`;
  const addonName = path.basename(destination);
  const serviceBody = `export { default } from '${addonName}/services/${serviceName}';`;
  log(appservice);
  if (!dryRun) {
    fse
      .outputFile(appservice, serviceBody)
      .then(() => {
        ok(`Success: Service ${serviceName}.js created in app`);
      })
      .catch((err) => {
        console.error(err);
      });
  }
};
