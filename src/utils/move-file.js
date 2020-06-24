'use strict';

const fs = require('fs');
const fse = require('fs-extra');

const { log, error, ok, warning } = require('./logging');

module.exports = function (options) {
  const { fileName, sourceFile, destPath, dryRun, deleteSource, fileType } = options;

  log(`Moving ${fileType}`);
  log('---------------');

  log(sourceFile);
  log(destPath);
  if (!dryRun) {
    if (fs.existsSync(sourceFile)) {
      return fse
      .copy(sourceFile, destPath)
      .then(() => {
        ok(`Success: ${fileType} - ${fileName} moved`);
        if (deleteSource) {
          fse.remove(sourceFile).then(() => {
            ok(`Success: ${fileType} - ${fileName} ${fileName} deleted`);
          })
        }
      })
      .catch((err) => error(err));
    } else {
      warning(`WARNING: There are no matching files of type ${fileType} with name ${fileName}`);
    }
  }

};
