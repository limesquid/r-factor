const traverse = require('@babel/traverse').default;
const { getSubImports } = require('../utils/ast');
const { cleanUpCode } = require('../utils');

class Imports {
  constructor(code, ast) {
    this.code = code;
    this.ast = ast;
    this.imports = extractImports(code, ast);
  }

  build() {
    const sortedAndFilteredImports = sortImports(this.imports);
    const imports = [];
    let newCode = this.code;

    sortedAndFilteredImports.forEach(({ code, identifier, module, subImports }) => {
      const importCode = createImportDeclarationCode(module, identifier, subImports);
      if (!isEmptyImport({ identifier, subImports })) {
        imports.push(importCode);
      }

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
    if (!newCode.startsWith('\n') && !newCode.match(/^\s*$/)) {
      code += '\n';
    }
    code += '\n';
    code += newCode;

    return cleanUpCode(code);
  }

  findImportIndex(module) {
    return this.imports.findIndex(
      (importDefinition) => importDefinition.module === module
    );
  }

  updateImportAtIndex(index, updatedImport) {
    this.imports = [
      ...this.imports.slice(0, index),
      updatedImport,
      ...this.imports.slice(index + 1)
    ];
  }

  add({ module, identifier, subImports }) {
    const existingImportIndex = this.findImportIndex(module);

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
      this.updateImportAtIndex(existingImportIndex, updatedImport);
    } else {
      this.imports.push({ module, identifier, subImports });
    }
  }

  removeDefault({ module }) {
    const existingImportIndex = this.findImportIndex(module);

    if (existingImportIndex < 0) {
      return;
    }

    const existingImport = this.imports[existingImportIndex];
    const updatedImport = {
      ...existingImport,
      identifier: null
    };
    this.updateImportAtIndex(existingImportIndex, updatedImport);
  }

  removeNamespace(/* { module } */) {
    /* TODO */
  }

  removeGlobal(/* { module } */) {
    /* TODO */
  }

  removeSubImports({ module, subImports = {} }) {
    const existingImportIndex = this.findImportIndex(module);

    if (existingImportIndex < 0) {
      return;
    }

    const existingImport = this.imports[existingImportIndex];
    const updatedImport = {
      ...existingImport,
      subImports: Object.keys(existingImport.subImports).reduce((result, subImport) => {
        if (!subImports.includes(subImport)) {
          result[subImport] = existingImport.subImports[subImport];
        }

        return result;
      }, {})
    };
    this.updateImportAtIndex(existingImportIndex, updatedImport);
  }
}

const isEmptyImport = ({ identifier, subImports }) => !identifier || Object.keys(subImports).length === 0;

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

const createImportDeclarationCode = (module, defaultImport, subImports = {}) => {
  const subImportStrings = Object.keys(subImports).map((subImportImportedName) => {
    const subImportLocalName = subImports[subImportImportedName];
    return subImportImportedName === subImportLocalName
      ? subImportImportedName
      : `${subImportImportedName} as ${subImportLocalName}`;
  });
  const sortedSubImportStrings = subImportStrings.sort();

  let code = '';
  code += 'import ';
  if (defaultImport) {
    code += defaultImport;
  }
  if (defaultImport && sortedSubImportStrings.length > 0) {
    code += ', ';
  }
  if (sortedSubImportStrings.length > 0) {
    code += `{ ${sortedSubImportStrings.join(', ')} }`;
  }
  code += ` from '${module}';`;

  return code;
};

module.exports = Imports;
