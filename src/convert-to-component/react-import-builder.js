const AbstractBuilder = require('../model/abstract-builder');;

class ReactImportBuilder extends AbstractBuilder {
  constructor(code) {
    super(code);
    this.propTypesNode = null;
  }

  build() {
    if (!this.node) {
      return this.code;
    }

    let code = '';
    code += this.buildPrefix();
    code += this.buildImport();
    code += this.buildSuffix();
    return code;
  }

  buildImport() {
    const subImports = [ 'Component' ];
    if (this.node.specifiers.length > 1) {
      subImports.push(...this.node.specifiers.slice(1).map((specifier) => {
        if (specifier.local.name !== specifier.imported.name) {
          return `${specifier.imported.name} as ${specifier.local.name}`;
        }
        return specifier.local.name || specifier.imported.name;
      }));
    }
    subImports.sort();
    return `import React, { ${subImports.join(', ')} } from 'react';`
  }
}

module.exports = ReactImportBuilder;
