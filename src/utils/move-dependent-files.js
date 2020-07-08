'use strict';

const fs = require('fs');
const execa = require('execa');
const path = require('path');

const { log } = require('./logging');
const { getParser } = require('codemod-cli').jscodeshift;
const jscodeshift = require('jscodeshift');

const j = getParser({ jscodeshift });
const PROJECT_ROOT = path.join(__dirname, '..', '..');
const ATAM_EXEC_PATH = path.join(PROJECT_ROOT, 'bin', 'cli.js');

const allowedDependentTypes = ['constants', 'utils', 'mixins', 'components'];

const getDependentsList = (j, root, appPrefix) => {
  let dependentFiles = [];
  root.find(j.ImportDeclaration).forEach((path) => {
    let importPath = path.node.source.value;
    if (importPath.startsWith(appPrefix)) {
      let [, entityType] = importPath.split('/');
      if (allowedDependentTypes.includes(entityType)) {
        let [, entityPath] = importPath.split(`${entityType}/`);
        let type = entityType.substring(0, entityType.length - 1);
        dependentFiles.push({ type, entityPath });
      }
    }
  });
  return dependentFiles;
};

module.exports = async function (options) {
  let { sourceFile, destination, dryRun = false, deleteSource, skipTests } = options;

  const source = fs.readFileSync(sourceFile);
  const root = j(source.toString());
  const packageFile = fs.readFileSync('package.json');
  const { name: appPrefix } = JSON.parse(packageFile);

  let dependentsList = getDependentsList(j, root, appPrefix);

  log('Dependent files', dependentsList);
  log(destination);

  return dependentsList.forEach(({ type, entityPath }) => {
    log('Moving dependent', type, entityPath);
    return execa(ATAM_EXEC_PATH, [
      type,
      entityPath,
      destination,
      '--dry-run',
      dryRun,
      '--skip-tests',
      skipTests,
      '--delete-source',
      deleteSource,
    ]);
  });
};
