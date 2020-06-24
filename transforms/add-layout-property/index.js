const { getParser } = require('codemod-cli').jscodeshift;
const { getOptions } = require('codemod-cli');

const addLayoutImport = (j, root, layoutPath) => {
  let allImports = root.find(j.ImportDeclaration);
  let oldImport = allImports.find(j.ImportDefaultSpecifier, {
    local: { name: 'layout' },
  });
  if (oldImport.length) {
    oldImport.closest(j.ImportDeclaration).get(0).node.source = j.literal(layoutPath);
  } else {
    let lastImport = allImports.at(allImports.length - 1);
    let newSpecifier = j.importDefaultSpecifier(j.identifier('layout'));
    let newImport = j.importDeclaration([newSpecifier], j.literal(layoutPath));
    lastImport.insertAfter(newImport);
  }
  return allImports;
};

const addLayoutProperty = (j, root) => {
  let component = root
    .find(j.CallExpression, {
      callee: { object: { name: 'Component' } },
    })
    .get(0);
  let componentObject = component.node.arguments[0];
  let existingLayout = componentObject.properties.findIndex((path) => path.key.name === 'layout');
  if (existingLayout !== -1) {
    componentObject.properties.splice(existingLayout, 1);
  }
  let layoutProperty = j.objectProperty(j.identifier('layout'), j.identifier('layout'));
  layoutProperty.shorthand = true;
  componentObject.properties.unshift(layoutProperty);
  return componentObject;
};

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const { layoutPath } = getOptions();
  const root = j(file.source);

  addLayoutImport(j, root, layoutPath);
  addLayoutProperty(j, root);

  return root.toSource({
    quote: 'single',
  });
};
