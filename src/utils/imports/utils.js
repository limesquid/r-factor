const traverse = require('@babel/traverse').default;
const stable = require('stable');
const settings = require('../../settings');
const { getSubImports } = require('../ast');

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

const extractImports = (code, ast) => {
  const imports = [];

  traverse(ast, {
    ImportDeclaration({ node }) {
      imports.push(createImport(code, node));
    }
  });

  return imports;
};

const isEmptyImport = ({ identifier, subImports }) => !identifier && Object.keys(subImports).length === 0;

const sortImports = (imports) => {
  if (settings.isModulesOrderAlphabetic) {
    return sortImportsAlphabetically(imports);
  }

  return sortImportsCustom(imports);
};

const sortImportsAlphabetically = (imports) => stable(
  [ ...imports ],
  (a, b) => {
    if (a.module.startsWith('.')) {
      if (!b.module.startsWith('.')) {
        return 1;
      }
    }
    if (b.module.startsWith('.')) {
      if (!a.module.startsWith('.')) {
        return -1;
      }
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

const buildImportDeclarationCode = (module, defaultImport, subImports = {}) => {
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

module.exports = {
  buildImportDeclarationCode,
  extractImports,
  isEmptyImport,
  sortImports
};
