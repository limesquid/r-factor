const traverse = require('@babel/traverse').default;
const { getSubImports } = require('../utils/ast');
const { cleanUpCode, createImportDeclarationCode } = require('../utils');

class Imports {
  constructor(code, ast) {
    this.code = code;
    this.ast = ast;
    this.imports = extractImports(code, ast);
  }

  build() {
    const sortedImports = sortImports(this.imports);
    const imports = [];
    let newCode = this.code;

    sortedImports.forEach(({ code, identifier, module, subImports }) => {
      const importCode = createImportDeclarationCode(module, identifier, subImports);
      imports.push(importCode);

      if (code) {
        newCode = newCode.replace(code, '');
      }
    });

    const importsCode = imports.join('\n');
    newCode = cleanUpCode(newCode);
    let code = '';
    code += importsCode;
    code += '\n';
    if (!newCode.startsWith('\n\n') && !newCode.match(/^\s*$/)) {
      code += '\n';
    }
    code += '\n';
    code += newCode;

    return cleanUpCode(code);
  }

  add({ module, identifier, subImports }) {
    const existingImportIndex = this.imports.findIndex(
      (importDefinition) => importDefinition.module === module
    );

    if (existingImportIndex >= 0) {
      const existingImport = this.imports[existingImportIndex];
      const updatedImport = {
        code: existingImport.code,
        module,
        identifier: identifier || existingImport.identifier,
        subImports: {
          ...existingImport.subImports,
          ...subImports
        }
      };
      this.imports = [
        ...this.imports.slice(0, existingImportIndex),
        updatedImport,
        ...this.imports.slice(existingImportIndex + 1)
      ];
    } else {
      this.imports.push({ module, identifier, subImports });
    }
  }

  remove() {
    /* TODO */
  }
}

const sortImports = (imports) => [ ...imports ].sort();

const extractImports = (code, ast) => {
  const imports = [];

  traverse(ast, {
    ImportDeclaration({ node }) {
      imports.push(createImport(code, node));
    }
  });

  return imports;
};

const createImport = (code, node) => ({
  code: code.substring(node.start, node.end),
  identifier: getIdentifier(node),
  module: getModule(node),
  subImports: getSubImports(node)
});

const getIdentifier = (node) => {
  const defaultImport = node.specifiers.find(({ type }) => type === 'ImportDefaultSpecifier');
  return defaultImport && defaultImport.local.name;
};

const getModule = (node) => node.source.value;

module.exports = Imports;
