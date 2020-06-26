const { getParser } = require('codemod-cli').jscodeshift;
const { getOptions } = require('codemod-cli');

const updateImport = (j, root, newImportPath, oldImportPath) => {
  root.find(j.ImportDeclaration).forEach((path) => {
    if (path.node.source.value.endsWith(oldImportPath)) {
      path.node.source.value = newImportPath;
    }
  });
};

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const root = j(file.source);
  const { newImportPath, oldImportPath } = getOptions();

  updateImport(j, root, newImportPath, oldImportPath);

  return root.toSource({
    quote: 'single',
  });
};
