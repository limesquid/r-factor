const Imports = require('../builders/imports');

const removeImportDeclaration = (source, ast, options) => {
  const imports = new Imports(source, ast);
  const subImports = options.subImports || [];

  if (options.identifier) {
    imports.removeDefault(options);
  }

  if (subImports.length > 0) {
    imports.removeSubImports(options);
  }

  return imports.build();
};

module.exports = removeImportDeclaration;
