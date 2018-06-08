const { cleanUpCode } = require('../index');
const {
  buildImportDeclarationCode,
  extractImports,
  isEmptyImport,
  sortImports
} = require('./utils');

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
      const importCode = buildImportDeclarationCode(module, identifier, subImports);
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

    if (newCode.trim().length > 0) {
      if (!newCode.startsWith('\n\n')) {
        code += '\n';
      }
      if (!newCode.startsWith('\n')) {
        code += '\n';
      }
      code += '\n';
      code += newCode;
    }

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

  removeSubImports({ module, subImports }) {
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

module.exports = Imports;
