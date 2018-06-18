const settings = require('../../settings');
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
    const firstGroup = this.groups[0];
    if (this.groups.length === 1 && !firstGroup.originalCode) {
      return `${firstGroup.build()}${settings.doubleEndOfLine}${this.code}`;
    }
    let newCode = this.code;
    this.groups.forEach((group) => {
      newCode = newCode.replace(group.originalCode, group.build());
    });
    return cleanUpCode(newCode);
  }

  sort() {
    this.groups.forEach((group) => group.sort());
    return this;
  }

  add({ groupIndex = 0, module, identifier, subImports }) {
    if (!this.groups[groupIndex]) {
      this.groups.push(new Group());
    }
    this.groups[groupIndex].add({ module, identifier, subImports });
    return this;
  }

  removeDefault({ module, removeImportIfEmpty }) {
    for (const group of this.groups) {
      group.removeDefault({ module, removeImportIfEmpty });
    }
    return this;
  }

  removeNamespace(/* { module } */) {
    /* TODO */
  }

  removeGlobal(/* { module } */) {
    /* TODO */
  }

  removeSubImports({ module, subImports }) {
    for (const group of this.groups) {
      group.removeSubImports({ module, subImports });
    }
    return this;
  }
}

module.exports = Imports;
