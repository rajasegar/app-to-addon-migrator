'use strict';

const addDefaultOptions = require('../utils/add-default-options');

module.exports.command = 'routex [route-name] [destination]';

module.exports.desc = 'Copy a route and its dependent components from app to addon';

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
  const fse = require('fs-extra');
  const inquirer = require('inquirer');
  const fuzzy = require('fuzzy');

  const { log } = require('../utils/logging');
  const { transform } = require('ember-template-recast');

  const copyComponent = require('../utils/copy-component');

  const { routeName, routeFolder, dryRun, deleteSource, skipTests } = options;
  const templatePath = 'app/templates/helpdesk';

  // Moving route.js
  log('Moving route.js');
  log('---------------');

  const sourceTemplate = routeFolder
    ? `${templatePath}/${routeFolder}/${routeName}.hbs`
    : `${templatePath}/${routeName}.hbs`;

  const components = [];

  const ignoreList = ['action', 'if', 't', 'component'];

  const componentsFromAddon = ['ember-wormhole', 'svg-jar', 'power-select'];

  function isValidComponent(name) {
    return !ignoreList.includes(name) && !name.includes('.') && !componentsFromAddon.includes(name);
  }

  fse.readFile(sourceTemplate, 'utf-8').then((data) => {
    console.log(data);
    transform(data, () => {
      return {
        BlockStatement(node) {
          if (isValidComponent(node.path.original)) {
            components.push(node.path.original);
          }
          return node;
        },

        MustacheStatement(node) {
          if (isValidComponent(node.path.original)) {
            components.push(node.path.original);
          }
          return node;
        },
      };
    });

    inquirer.registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'));
    inquirer
      .prompt([
        {
          type: 'checkbox-plus',
          name: 'components',
          message: 'Select [spacebar] components to copy/move:',
          pageSize: 10,
          highlight: true,
          searchable: true,
          source(answersSoFar, input) {
            input = input || '';

            return new Promise(function (resolve) {
              const fuzzyResult = fuzzy.filter(input, components);

              const data = fuzzyResult.map(function (element) {
                return element.original;
              });

              resolve(data);
            });
          },
        },
      ])
      .then(function (answers) {
        console.log(answers.components);
        answers.components.forEach((component) => {
          let _componentFolder;
          let _componentName = component;
          // component namespace is present
          if (component.includes('/')) {
            [_componentFolder, _componentName] = component.split('/');
          }
          const opts = {
            componentFolder: _componentFolder,
            componentName: _componentName,
            // addonName,
            dryRun,
            deleteSource,
            skipTests,
          };

          copyComponent(opts);
        });
      });
  });
};
