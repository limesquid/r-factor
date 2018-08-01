const traverse = require('@babel/traverse').default;
const stable = require('stable');
const settings = require('../../settings');
const { indentCode } = require('../../utils');
const { getSubImports } = require('../../utils/ast');

const createImport = (code, node) => ({
  code: code.substring(node.start, node.end),
  identifier: getIdentifier(node),
  module: getModule(node),
  subImports: getSubImports(node),
  namespace: getNamespaceSpecifier(node),
  start: node.start,
  startLine: node.loc.start.line,
  end: node.end,
  endLine: node.loc.end.line
});

const getIdentifier = (node) => {
  const defaultImport = node.specifiers.find(({ type }) => type === 'ImportDefaultSpecifier');
  return defaultImport && defaultImport.local.name;
};

const getNamespaceSpecifier = (node) => {
  if (node.specifiers.length === 1 && node.specifiers[0].type === 'ImportNamespaceSpecifier') {
    return node.specifiers[0].local.name;
  }
  return null;
};

const getModule = (node) => node.source.value;

const extractImports = (code, ast) => {
  const imports = [];

  traverse(ast, {
    ImportDeclaration({ node }) {
      imports.push(createImport(code, node));
    }
  });

  return imports;
};

const extractGroups = (code, ast) => groupImports(extractImports(code, ast));

const groupImports = (imports) => {
  const groups = [];
  let group = [];
  let previousImport = null;

  for (const importData of imports) {
    if (!previousImport || importData.startLine === previousImport.endLine + 1) {
      group.push(importData);
    } else {
      groups.push(group);
      group = [ importData ];
    }
    previousImport = importData;
  }

  if (group.length > 0 && groups.indexOf(group) === -1) {
    groups.push(group);
  }

  return groups;
};

const isEmptyImport = ({ identifier, subImports }) => !identifier && Object.keys(subImports).length === 0;

const sortImports = (imports) => {
  const importsWithSortedSubImports = imports.map(sortSubImports);
  if (settings.isModulesOrderAlphabetic) {
    return sortImportsAlphabetically(importsWithSortedSubImports);
  }

  return sortImportsCustom(importsWithSortedSubImports);
};

const sortSubImports = (importData) => ({
  ...importData,
  subImports: [ ...importData.subImports ].sort(
    (a, b) => a.name.localeCompare(b.name)
  )
});

const sortImportsAlphabetically = (imports) => stable(
  [ ...imports ],
  (a, b) => {
    if (a.module.startsWith('.') && !b.module.startsWith('.')) {
      return 1;
    }
    if (b.module.startsWith('.') && !a.module.startsWith('.')) {
      return -1;
    }
    return a.module.localeCompare(b.module);
  }
);

const sortImportsCustom = (imports) => {
  const modulesToSort = imports.filter(
    ({ module }) => settings.modulesOrder.includes(module)
  );
  const modulesToKeep = imports.filter(
    ({ module }) => !settings.modulesOrder.includes(module)
  );

  return [
    ...stable([ ...modulesToSort ], (a, b) => {
      const aIndex = settings.modulesOrder.indexOf(a.module);
      const bIndex = settings.modulesOrder.indexOf(b.module);
      if (aIndex < bIndex) {
        return -1;
      }
      if (aIndex > bIndex) {
        return 1;
      }
      return 0;
    }),
    ...modulesToKeep
  ];
};

// eslint-disable-next-line
const buildImportDeclarationCode = (importData) => {
  const { identifier, module, namespace, subImports, startLine, endLine } = importData;
  const isMultiline = startLine !== endLine;
  const subImportStrings = subImports.map(({ name, alias }) => {
    if (!alias || name === alias) {
      return name;
    }
    return `${name} as ${alias}`;
  });

  let code = '';
  code += 'import ';
  if (namespace) {
    code += `* as ${namespace}`;
  }

  if (identifier) {
    code += identifier;

    if (subImportStrings.length > 0) {
      code += ', ';
    }
  }

  if (subImportStrings.length > 0) {
    if (isMultiline) {
      const subImportsCode = subImportStrings.join(`,${settings.endOfLine}`) + settings.trailingComma;
      const indentedSubImports = indentCode(subImportsCode, settings.indent);
      code += `{${settings.endOfLine}${indentedSubImports}${settings.endOfLine}}`;
    } else {
      code += `{ ${subImportStrings.join(', ')} }`;
    }
  }
  if (namespace || identifier || subImportStrings.length > 0) {
    code += ' from ';
  }
  const quote = settings.quote === '`' ? '\'' : settings.quote;
  code += `${quote}${module}${quote}${settings.semicolon}`;

  return code;
};

const extractOriginalCode = (code, imports) => {
  if (imports.length === 0) {
    return '';
  }

  const firstImport = imports[0];
  const lastImport = imports[imports.length - 1];
  return code.substring(firstImport.start, lastImport.end);
};

module.exports = {
  buildImportDeclarationCode,
  extractGroups,
  extractImports,
  extractOriginalCode,
  isEmptyImport,
  sortImports
};
