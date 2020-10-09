'use strict';

const addDefaultOptions = require('../utils/add-default-options');

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

  addDefaultOptions(yargs);
};

module.exports.handler = async function handler(options) {
  const path = require('path');
  const moveFile = require('../utils/move-file');
  const createAppExport = require('../utils/create-app-export');

  const { serviceName, destination, serviceFolder, dryRun } = options;

  const servicePath = 'app/services';
  const packagePath = path.join('.', destination) || 'packages/engines';

  // Moving service.js
  const sourceService = serviceFolder
    ? `${servicePath}/${serviceFolder}/${serviceName}.js`
    : `${servicePath}/${serviceName}.js`;
  const destservice = `${packagePath}/addon/services/${serviceName}.js`;

  moveFile(
    Object.assign(
      {
        fileName: serviceName,
        sourceFile: sourceService,
        destPath: destservice,
        fileType: 'Service',
      },
      options
    )
  );

  // Moving service tests
  const sourceTest = serviceFolder
    ? `tests/unit/services/${serviceFolder}/${serviceName}-test.js`
    : `tests/unit/services/${serviceName}-test.js`;
  const destTest = `${packagePath}/tests/unit/services/${serviceName}-test.js`;

  moveFile(
    Object.assign(
      {
        fileName: serviceName,
        sourceFile: sourceTest,
        destPath: destTest,
        fileType: 'Service',
      },
      options
    )
  );

  // Create service assets to app folder in addon

  createAppExport({
    fileName: serviceName,
    sourceFile: sourceService,
    fileOptions: {
      ext: 'js',
      type: 'services',
    },
    dryRun,
    packagePath,
    destination,
    fileType: 'Service',
  });
};
