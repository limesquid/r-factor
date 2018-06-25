const Imports = require('../builders/imports');

const removeImportDeclaration = (source, ast, options) => {
  const imports = new Imports(source, ast);
  const subImports = options.subImports || {};

  if (options.identifier) {
    imports.removeDefault(options);
  }

  if (options.namespace) {
    imports.removeNamespace(options);
  }

  if (options.global) {
    imports.removeGlobal(options);
  }

  if (Object.keys(subImports).length > 0) {
    imports.removeSubImports(options);
  }

  return imports.build();
};

module.exports = removeImportDeclaration;
