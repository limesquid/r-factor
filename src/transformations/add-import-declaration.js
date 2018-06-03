const traverse = require('@babel/traverse').default;
const { getDefaultImportName, getSubImports } from '../../utils/ast';

const addImportDeclaration = (source, ast, options) => {
  const { module, identifier, subImports } = options;
  let moduleImportNode = null;

  traverse(ast, {
    ImportDeclaration({ node }) {
      if (node.source.value === module) {
        moduleImportNode = node;
      }
    }
  });

  return moduleImportNode
    ? extendImportDeclaration(source, moduleImportNode, { module, identifier, subImports })
    : createImportDeclaration(source, { module, identifier, subImports });
};

const createImportDeclarationCode = (module, defaultImport, subImports = {}) => {
  const subImportStrings = Object.keys(subImports).map((subImportImportedName) => {
    const subImportLocalName = subImports[subImportImportedName];
    return subImportImportedName === subImportLocalName
      ? subImportImportedName
      : `${subImportImportedName} as ${subImportLocalName}`;
  });
  const sortedSubImportStrings = subImportStrings.sort();

  let code = '';
  code += 'import ';
  code += defaultImport ? `${defaultImport}` : '';
  code += sortedSubImportStrings.length > 0 ? ', ' : '';
  code += sortedSubImportStrings.length > 0
    ? `{ ${sortedSubImportStrings.join(', ')} }`
    : '';
  code += ` from '${module}';`;

  return code;
};

const extendImportDeclaration = (source, moduleImportNode, options) => {
  const { module, identifier, subImports: newSubImports } = options;
  const existingSubImports = getSubImports(moduleImportNode);
  const subImports = {
    ...existingSubImports,
    ...newSubImports
  };
  const defaultImport = identifier || getDefaultImportName(moduleImportNode);
  const importDeclarationCode = createImportDeclarationCode(module, defaultImport, subImports);

  let code = '';
  code += source.slice(0, moduleImportNode.start);
  code += importDeclarationCode;
  code += source.slice(moduleImportNode.end);

  return code;
};

const createImportDeclaration = (source, { module, identifier, subImports }) => {
  const importDeclarationCode = createImportDeclarationCode(module, identifier, subImports);
  const code = `${importDeclarationCode}\n${source}`;

  return code;
};

module.exports = addImportDeclaration;
