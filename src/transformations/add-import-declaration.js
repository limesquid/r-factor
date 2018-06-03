const Imports = require('../utils/imports');

const addImportDeclaration = (source, ast, options) => {
  const imports = new Imports(source, ast);
  imports.add(options);
  return imports.build();
};

module.exports = addImportDeclaration;
