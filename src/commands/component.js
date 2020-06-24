'use strict';

const addDefaultOptions = require('../utils/add-default-options');

module.exports.command = 'component [component-name] [destination]';

module.exports.desc = 'Copy a component from app to addon';

module.exports.builder = function builder(yargs) {
  yargs.positional('component-name', {
    describe: 'The name of the component to copy',
  });

  yargs.positional('destination', {
    describe: 'The relative path of the addon folder to copy to',
  });

  yargs.option('component-folder', {
    alias: 'f',
    demandOption: false,
    describe: 'The name of the component folder if it is namespaced within app/helpers',
    type: 'string',
  });

  addDefaultOptions(yargs);
};

module.exports.handler = async function handler(options) {
  const copyComponent = require('../utils/copy-component');
  const { readdirSync } = require('fs')
  const componentPath = 'app/components';

  let { componentFolder, componentName } = options;
  let sourcePath = componentFolder
    ? `${componentPath}/${componentFolder}/${componentName}`
    : `${componentPath}/${componentName}`;
  
  const getDirectories = source =>
    readdirSync(source, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
  
  let folderList = getDirectories(sourcePath) || []
  folderList
  copyComponent(options);
};
