const Imports = require('../utils/imports');

const sortImports = (source, ast) => {
  const imports = new Imports(source, ast);
  imports.sort();
  return imports.build();
};

module.exports = sortImports;
