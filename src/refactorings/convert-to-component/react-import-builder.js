const settings = require('../../settings');
const { Builder } = require('../../model');

class ReactImportBuilder extends Builder {
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
    const subImports = [ settings.componentSuperclass ];
    subImports.push(...this.node.specifiers.slice(1).map((specifier) => {
      if (specifier.local.name !== specifier.imported.name) {
        return `${specifier.imported.name} as ${specifier.local.name}`;
      }
      return specifier.local.name;
    }));
    const sortedSubImports = Array.from(new Set(subImports)).sort();
    return `import React, { ${sortedSubImports.join(', ')} } from 'react'${settings.semicolon}`;
  }
}

module.exports = ReactImportBuilder;
