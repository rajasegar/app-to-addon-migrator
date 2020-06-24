'use strict';

const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

const { log, error, ok, warning } = require('./logging');

module.exports = function (options) {
  const { fileName, sourceFile, dryRun, deleteSource, fileType, keepTestsInHost } = options;

  let { destPath } = options;

  log(`Moving ${fileType}`);
  log('---------------');

  log(`keepTestsInHost - ${keepTestsInHost}`);
  log(`destMatched - ${destPath.match(/\/tests\//g)}`);

  if (keepTestsInHost && destPath.match(/\/tests\//g)) {
    destPath = path.join('tests', destPath);
  }

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
            });
          }
        })
        .catch((err) => error(err));
    } else {
      warning(`WARNING: There are no matching files of type ${fileType} with name ${fileName}`);
    }
  }
};
