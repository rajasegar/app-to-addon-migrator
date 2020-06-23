'use strict';
const path = require('path');

const fse = require('fs-extra');

const { log, ok } = require('./logging');

module.exports = function (options) {
  const {
    fileName,
    fileOptions,
    dryRun,
    fileType,
    packagePath,
    destination,
    modulePrefix
  } = options;

  log(`\nCreating ${fileType} assets in app folder `);
  log('----------------------------------- ');

  const destPath = `${packagePath}/app/${fileOptions.type}/${fileName}.${fileOptions.ext}`;
  const addonName = path.basename(destination);
  const fileContent = `export { default } from '${modulePrefix || addonName}/${fileOptions.type}/${fileName}';`;
  

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
