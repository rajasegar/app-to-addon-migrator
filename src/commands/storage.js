'use strict';

const addDefaultOptions = require('../utils/add-default-options');

module.exports.command = 'storage [storage-name] [destination]';

module.exports.desc = 'Copy a storage from app to addon';

module.exports.builder = function builder(yargs) {
  yargs.positional('storage-name', {
    describe: 'The name of the storage to copy',
  });
  yargs.positional('destination', {
    describe: 'The relative path of the addon folder to copy to',
  });

  yargs.option('storage-folder', {
    alias: 'f',
    demandOption: false,
    describe: 'The name of the storage folder if it is namespaced within app/storages',
    type: 'string',
  });

  addDefaultOptions(yargs);
};

module.exports.handler = async function handler(options) {
  const path = require('path');

  const moveFile = require('../utils/move-file');

  const storagePath = 'app/storages';
  const { storageName, destination, storageFolder } = options;
  const packagePath = path.join('.', destination) || 'packages/engines';

  // Moving storage.js
  const sourcestorage = storageFolder
    ? `${storagePath}/${storageFolder}/${storageName}.js`
    : `${storagePath}/${storageName}.js`;
  const deststorage = `${packagePath}/app/storages/${storageName}.js`;

  moveFile(
    Object.assign(
      {
        fileName: storageName,
        sourceFile: sourcestorage,
        destPath: deststorage,
        fileType: 'Storage',
      },
      options
    )
  );
};
