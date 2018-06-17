const { cleanUpCode } = require('../index');
const { extractGroups } = require('./utils');
const Group = require('./group');

class Imports {
  constructor(code, ast) {
    this.code = code;
    this.ast = ast;
    this.groups = extractGroups(code, ast).map((group) => new Group(code, group));
  }

  build() {
    let newCode = this.code;
    this.groups.forEach((group) => {
      newCode = newCode.replace(group.originalCode, group.build());
    });
    return cleanUpCode(newCode);
  }

  findGroupIndex(module) {
    return this.groups.findIndex(
      (group) => group.findImportIndex(module) >= 0
    );
  }

  sort() {
    this.groups.forEach((group) => group.sort());
  }

  add({ groupIndex = 0, module, identifier, subImports }) {
    if (!this.groups[groupIndex]) {
      this.groups.push(new Group());
    }
    this.groups[groupIndex].add({ module, identifier, subImports });
  }

  removeDefault({ module, removeImportIfEmpty }) {
    const groupIndex = this.findGroupIndex(module);
    if (groupIndex >= 0) {
      this.groups[groupIndex].removeDefault({ module, removeImportIfEmpty });
    }
  }

  removeNamespace(/* { module } */) {
    /* TODO */
  }

  removeGlobal(/* { module } */) {
    /* TODO */
  }

  removeSubImports({ module, subImports }) {
    const groupIndex = this.findGroupIndex(module);
    if (groupIndex >= 0) {
      this.groups[groupIndex].removeSubImports({ module, subImports });
    }
  }
}

module.exports = Imports;
