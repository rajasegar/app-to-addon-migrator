'use strict';

const path = require('path');

const MoveFile = require('./move-file');
const CreateAppExport = require('./create-app-export');

module.exports = function (options) {
  const componentPath = 'app/components';
  const {
    componentFolder,
    componentName,
    destination,
    dryRun,
    pods,
    deleteSource,
    modulePrefix
  } = options;
  const packagePath = path.join('.', destination) || 'packages/engines';

  // Moving component.js
  // IMPORTANT NOTE: We're deliberately avoiding POD structure in engines
  // Hence, the components are moved appropriately splitting the js and hbs
  // from a single folder
  let sourceComponent;

  if (pods) {
    sourceComponent = componentFolder
      ? `${componentPath}/${componentFolder}/${componentName}/component.js`
      : `${componentPath}/${componentName}/component.js`;
  } else {
    sourceComponent = componentFolder
      ? `${componentPath}/${componentFolder}/${componentName}.js`
      : `${componentPath}/${componentName}.js`;
  }

  const destComponent = `${packagePath}/addon/components/${componentName}.js`;

  MoveFile({
    deleteSource,
    fileName: componentName,
    sourceFile: sourceComponent,
    destPath: destComponent,
    fileType: 'Component',
    dryRun
  });

  // Moving component template.hbs

  let sourceTemplate;
  if (pods) {
    sourceTemplate = componentFolder
      ? `${componentPath}/${componentFolder}/${componentName}/template.hbs`
      : `${componentPath}/${componentName}/template.hbs`;
  } else {
    sourceTemplate = componentFolder
      ? `app/templates/components/${componentFolder}/${componentName}.hbs`
      : `app/templates/components/${componentName}.hbs`;
  }
  const destTemplate = `${packagePath}/addon/templates/components/${componentName}.hbs`;

  MoveFile({
    deleteSource,
    fileName: componentName,
    sourceFile: sourceTemplate,
    destPath: destTemplate,
    fileType: 'Component Template',
    dryRun
  });

  // Moving component tests

  let sourceTest;
  if (pods) {
    sourceTest = componentFolder
      ? `tests/integration/components/${componentFolder}/${componentName}/component-test.js`
      : `tests/integration/components/${componentName}/component-test.js`;
  } else {
    sourceTest = componentFolder
      ? `tests/integration/components/${componentFolder}/${componentName}-test.js`
      : `tests/integration/components/${componentName}-test.js`;
  }

  const destTest = `${packagePath}/tests/integration/components/${componentName}-test.js`;

  MoveFile({
    deleteSource,
    fileName: componentName,
    sourceFile: sourceTest,
    destPath: destTest,
    fileType: 'Component Test',
    dryRun
  });

  // Create component assets to app folder in addon
  CreateAppExport({
    fileName: componentName,
    fileOptions: {
      ext: 'js',
      type: 'components'
    },
    dryRun,
    packagePath,
    destination,
    modulePrefix,
    fileType: 'Component'
  });
};
