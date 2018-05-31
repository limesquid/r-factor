const { Builder } = require('../../model');

class ReactImportBuilder extends Builder {
  constructor(code) {
    super(code);
    this.propTypesNode = null;
  }

  build(superClass) {
    if (!this.node) {
      return this.code;
    }

    let code = '';
    code += this.buildPrefix();
    code += this.buildImport(superClass);
    code += this.buildSuffix();
    return code;
  }

  buildImport(superClass) {
    const subImports = [];
    subImports.push(...this.node.specifiers.slice(1).map((specifier) => {
      if (specifier.local.name !== specifier.imported.name) {
        return `${specifier.imported.name} as ${specifier.local.name}`;
      }
      return specifier.local.name;
    }));
    const sortedSubImports = Array.from(new Set(subImports)).sort()
      .filter((subImport) => subImport !== superClass);
    if (sortedSubImports.length === 0) {
      return 'import React from \'react\';';
    }
    return `import React, { ${sortedSubImports.join(', ')} } from 'react';`;
  }
}

module.exports = ReactImportBuilder;