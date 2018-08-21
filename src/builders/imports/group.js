const settings = require('../../settings');
const { cleanUpCode } = require('../../utils');
const {
  buildImportDeclarationCode,
  extractOriginalCode,
  isEmptyImport,
  sortImports
} = require('./utils');

class Group {
  constructor(code, imports = []) {
    this.code = code;
    this.imports = imports;
    this.originalCode = extractOriginalCode(code, imports);
  }

  build() {
    const imports = [];

    this.imports.forEach((importData) => {
      const importCode = buildImportDeclarationCode(importData);
      imports.push(importCode);
    });

    const importsCode = imports.join(settings.endOfLine);
    return cleanUpCode(importsCode);
  }

  findImportIndex(module) {
    return this.imports.findIndex(
      (importDefinition) => importDefinition.module === module
    );
  }

  sort() {
    this.imports = sortImports(this.imports);
  }

  updateImportAtIndex(index, updatedImport, removeImportIfEmpty = false) {
    if (removeImportIfEmpty && isEmptyImport(updatedImport)) {
      this.imports = [
        ...this.imports.slice(0, index),
        ...this.imports.slice(index + 1)
      ];
      return;
    }

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
        ...existingImport,
        code: existingImport.code,
        module,
        identifier: identifier || existingImport.identifier,
        subImports: [
          ...existingImport.subImports.filter(
            ({ name }) => !subImports.find((subImport) => subImport.name === name)
          ),
          ...subImports
        ]
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

    this.updateImportAtIndex(existingImportIndex, updatedImport, removeImportIfEmpty);
  }

  removeSubImports({ module, subImports, removeImportIfEmpty }) {
    const existingImportIndex = this.findImportIndex(module);

    if (existingImportIndex < 0) {
      return;
    }

    const existingImport = this.imports[existingImportIndex];
    const updatedImport = {
      ...existingImport,
      subImports: existingImport.subImports.filter(
        (subImport) => !subImports.includes(subImport.name)
      )
    };
    this.updateImportAtIndex(existingImportIndex, updatedImport, removeImportIfEmpty);
  }
}

module.exports = Group;
