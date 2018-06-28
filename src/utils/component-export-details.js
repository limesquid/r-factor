const traverse = require('@babel/traverse').default;
const { isIdentifier } = require('@babel/types');
const {
  isComponentDeclaration,
  isExportDefaultFunctionalComponentDeclaration,
  isFunctionalComponentDeclaration
} = require('./ast');

const getComponentExportDetails = (ast) => {
  let isDefaultExport = false;
  let isInstantExport = false;
  let originalComponentName = null;
  let componentExportPath = null;
  let classComponentPath = null;
  let functionalComponentPath = null;
  let closestHoCPath = null;
  let componentIdentifierInHoC = null;

  traverse(ast, {
    ExportDefaultDeclaration(path) {
      const { node } = path;
      if (originalComponentName) {
        isDefaultExport = true;
        isInstantExport = false;
        componentExportPath = path;
      }

      const isComponent = isComponentDeclaration(node.declaration);
      const isExportedFunctionalComponent = isExportDefaultFunctionalComponentDeclaration(node);
      if (isComponent || isExportedFunctionalComponent) {
        isDefaultExport = true;
        isInstantExport = true;
        componentExportPath = path;
      }
    },
    ExportNamedDeclaration(path) {
      if (originalComponentName) {
        componentExportPath = path;
        return;
      }
      const variableDeclaration = path.node.declaration;
      if (isFunctionalComponentDeclaration(variableDeclaration)) {
        isInstantExport = true;
        componentExportPath = path;
      }

      if (isComponentDeclaration(variableDeclaration)) {
        isInstantExport = true;
        componentExportPath = path;
      }
    },
    VariableDeclaration(path) {
      if (isFunctionalComponentDeclaration(path.node)) {
        originalComponentName = path.node.declarations[0].id.name;
        functionalComponentPath = path;
      }
    },
    ClassDeclaration(path) {
      if (isComponentDeclaration(path.node)) {
        originalComponentName = path.node.id.name;
        classComponentPath = path;
      }
    },
    CallExpression(path) {
      const { node } = path;
      if (!originalComponentName || closestHoCPath) {
        return;
      }

      const componentIdentifier = node.arguments.find(
        (argument) => isIdentifier(argument, { name: originalComponentName })
      );
      if (componentIdentifier) {
        closestHoCPath = path;
        componentIdentifierInHoC = componentIdentifier;
      }
    }
  });

  return {
    isDefaultExport,
    isInstantExport,
    originalComponentName,
    componentExportPath,
    componentIdentifierInHoC,
    classComponentPath,
    closestHoCPath,
    functionalComponentPath
  };
};

module.exports = getComponentExportDetails;
