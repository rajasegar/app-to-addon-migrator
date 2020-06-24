'use strict';

const addDefaultOptions = require('../utils/add-default-options');

module.exports.command = 'route [route-name] [destination]';

module.exports.desc = 'Copy a route with controller from app to addon';

module.exports.builder = function builder(yargs) {
  yargs.positional('route-name', {
    describe: 'The name of the route to copy',
  });
  yargs.positional('destination', {
    describe: 'The relative path of the addon folder to copy to',
  });

  yargs.option('route-folder', {
    alias: 'f',
    demandOption: false,
    describe: 'The name of the route folder if it is namespaced within app/helpers',
    type: 'string',
  });

  addDefaultOptions(yargs);
};

module.exports.handler = async function handler(options) {
  const path = require('path');
  const MoveFile = require('../utils/move-file');

  const { routeName, destination, routeFolder, dryRun, deleteSource } = options;

  const routePath = 'app/routes';
  const templatePath = 'app/templates';
  const packagePath = path.join('.', destination) || 'packages/engines';
  const testPath = 'tests/unit/routes';
  const controllerPath = 'app/controllers';
  const controllerTestPath = 'tests/unit/controllers';

  // Moving route.js
  const sourceRoute = routeFolder
    ? `${routePath}/${routeFolder}/${routeName}.js`
    : `${routePath}/${routeName}.js`;
  const destRoute = `${packagePath}/addon/routes/${routeName}.js`;

  MoveFile({
    deleteSource,
    fileName: routeName,
    sourceFile: sourceRoute,
    destPath: destRoute,
    fileType: 'Route',
    dryRun
  });

  // Moving route template.hbs
  const sourceTemplate = routeFolder
    ? `${templatePath}/${routeFolder}/${routeName}.hbs`
    : `${templatePath}/${routeName}.hbs`;

  const destTemplate = `${packagePath}/addon/templates/${routeName}.hbs`;

  MoveFile({
    deleteSource,
    fileName: routeName,
    sourceFile: sourceTemplate,
    destPath: destTemplate,
    fileType: 'Route Template',
    dryRun
  });


  // Moving route tests
  const sourceTest = routeFolder
    ? `${testPath}/${routeFolder}/${routeName}-test.js`
    : `${testPath}/${routeName}-test.js`;
  const destTest = `${packagePath}/tests/unit/routes/${routeName}-test.js`;
  MoveFile({
    deleteSource,
    fileName: routeName,
    sourceFile: sourceTest,
    destPath: destTest,
    fileType: 'Route Test',
    dryRun
  });

  // Move the controllers
  const sourceController = routeFolder
    ? `${controllerPath}/${routeFolder}/${routeName}.js`
    : `${controllerPath}/${routeName}.js`;
  const destController = `${packagePath}/addon/controllers/${routeName}.js`;

  MoveFile({
    deleteSource,
    fileName: routeName,
    sourceFile: sourceController,
    destPath: destController,
    fileType: 'Controller',
    dryRun
  });

  // Moving controller tests
  const sourceControllerTest = routeFolder
    ? `${controllerTestPath}/${routeFolder}/${routeName}-test.js`
    : `${controllerTestPath}/${routeName}-test.js`;
  const destControllerTest = `${packagePath}/tests/unit/controllers/${routeName}-test.js`;

    
  MoveFile({
    deleteSource,
    fileName: routeName,
    sourceFile: sourceControllerTest,
    destPath: destControllerTest,
    fileType: 'Controller Test',
    dryRun
  });
};
