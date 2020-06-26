'use strict';
const path = require('path');
const fs = require('fs');
const execa = require('execa');
const fse = require('fs-extra');

const { log, ok } = require('./logging');

const PROJECT_ROOT = path.join(__dirname, '..', '..');
const CODEMOD_EXEC_PATH = path.join(PROJECT_ROOT, 'bin', 'atam-codemod-cli.js');

const updateImportsWhiteList = ['Constant', 'Helper', 'Model', 'Util', 'Mixin'];

module.exports = function (options) {
  const { fileName, sourceFile, fileOptions, dryRun, fileType, packagePath, destination } = options;

  log(`\nCreating ${fileType} assets in app folder `);
  log('----------------------------------- ');

  const destPath = `${packagePath}/app/${fileOptions.type}/${fileName}.${fileOptions.ext}`;

  const packageFile = fs.readFileSync(`${packagePath}/package.json`);
  const { name: packageName } = JSON.parse(packageFile);
  const addonName = packageName || path.basename(destination);

  const exportPath = `${addonName}/${fileOptions.type}/${fileName}`;
  const fileContent = `export { default } from '${exportPath}';`;

  log(destPath);
  if (!dryRun) {
    return fse
      .outputFile(destPath, fileContent)
      .then(async () => {
        if (updateImportsWhiteList.includes(fileType)) {
          let { dir, name } = path.parse(sourceFile);
          let sourcePath = path.join(dir, name);
          const entityPath = `/${fileOptions.type}/`;
          const [, filePath] = sourcePath.split(entityPath);
          const oldImportPath = `${entityPath}${filePath}`;

          log(`\nUpdating the import paths matching ${oldImportPath} to ${exportPath}`);

          await execa(CODEMOD_EXEC_PATH, [
            'update-imports',
            './**/*.js',
            '--oldImportPath',
            oldImportPath,
            '--newImportPath',
            exportPath,
          ]);

          ok(`Success: Updated the import paths to ${exportPath}`);
        }
        ok(`Success: ${fileType} - ${fileName} created in app`);
      })
      .catch((err) => {
        console.error(err);
      });
  }
};
