'use strict';
const path = require('path');
const fs = require('fs');

const fse = require('fs-extra');

const { log, ok } = require('./logging');

module.exports = function (options) {
  const { fileName, fileOptions, dryRun, fileType, packagePath, destination } = options;

  log(`\nCreating ${fileType} assets in app folder `);
  log('----------------------------------- ');

  const destPath = `${packagePath}/app/${fileOptions.type}/${fileName}.${fileOptions.ext}`;

  const packageFile = fs.readFileSync(`${packagePath}/package.json`);
  const { name: packageName } = JSON.parse(packageFile);
  const addonName = packageName || path.basename(destination);

  const fileContent = `export { default } from '${addonName}/${fileOptions.type}/${fileName}';`;

  log(destPath);
  if (!dryRun) {
    fse
      .outputFile(destPath, fileContent)
      .then(() => {
        ok(`Success: ${fileType} - ${fileName} created in app`);
      })
      .catch((err) => {
        console.error(err);
      });
  }
};
