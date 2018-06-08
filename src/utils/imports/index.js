const settings = require('../../settings');
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
    const imports = [];
    let newCode = this.code;

    this.imports.forEach((importData) => {
      const importCode = buildImportDeclarationCode(importData);
      if (!isEmptyImport(importData)) {
        imports.push(importCode);
      }

      if (importData.code) {
        newCode = newCode.replace(importData.code, '');
      }
    });

    const importsCode = imports.join(settings.endOfLine);
    newCode = cleanUpCode(newCode);
    let code = '';
    code += importsCode;
    code += settings.endOfLine;

    if (newCode.trim().length > 0) {
      if (!newCode.startsWith(settings.doubleEndOfLine)) {
        code += settings.endOfLine;
      }
      if (!newCode.startsWith(settings.endOfLine)) {
        code += settings.endOfLine;
      }
      code += settings.endOfLine;
      code += newCode;
    }

    return cleanUpCode(code);
  }

  findImportIndex(module) {
    return this.imports.findIndex(
      (importDefinition) => importDefinition.module === module
    );
  }

  sort() {
    this.imports = sortImports(this.imports);
  }

  updateImportAtIndex(index, updatedImport) {
    this.imports = [
      ...this.imports.slice(0, index),
      updatedImport,
      ...this.imports.slice(index + 1)
    ];
  }

  add({ module, identifier, subImports = {} }) {
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

  removeDefault({ module, removeImportIfEmpty }) {
    const existingImportIndex = this.findImportIndex(module);

    if (existingImportIndex < 0) {
      return;
    }

    const existingImport = this.imports[existingImportIndex];
    const updatedImport = {
      ...existingImport,
      identifier: null
    };
    const hasSubImports = Object.keys(updatedImport.subImports).length > 0;

    if (removeImportIfEmpty && !hasSubImports) {
      this.removeImport(existingImportIndex);
    } else {
      this.updateImportAtIndex(existingImportIndex, updatedImport);
    }
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

  removeImport(index) {
    const { code } = this.imports[index];
    this.code = this.code.replace(code, '');
    this.imports = [
      ...this.imports.slice(0, index),
      ...this.imports.slice(index + 1)
    ];
  }
}

module.exports = Imports;
