const traverse = require('@babel/traverse').default;
const { isIdentifier } = require('@babel/types');
const {
  isComponentDeclaration,
  isExportDefaultFunctionalComponentDeclaration,
  isFunctionalComponentDeclaration,
  isIdentifierInside
} = require('./ast');

const getComponentExportDetails = (ast) => {
  let isDefaultExport = false;
  let isInstantExport = false;
  let exportedComponentName = null;
  let originalComponentName = null;
  let componentExportPath = null;
  let componentReturnPath = null;
  let classComponentPath = null;
  let functionalComponentPath = null;
  let closestHoCPath = null;
  let componentIdentifierInHoC = null;

  traverse(ast, {
    ExportDefaultDeclaration(path) {
      const { node } = path;
      if (originalComponentName && isIdentifierInside(path, originalComponentName)) {
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

      if (isComponent) {
        classComponentPath = path.get('declaration');
      } else if (isExportedFunctionalComponent) {
        functionalComponentPath = path.get('declaration');
      } 
    },
    ExportNamedDeclaration(path) {
      if (originalComponentName && isIdentifierInside(path, originalComponentName)) {
        componentExportPath = path;
        exportedComponentName = path.node.declaration.declarations[0].id.name;
        return;
      }
      const variableDeclaration = path.node.declaration;
      if (isFunctionalComponentDeclaration(variableDeclaration)) {
        isInstantExport = true;
        componentExportPath = path;
        functionalComponentPath = path.get('declaration');
      }

      if (isComponentDeclaration(variableDeclaration)) {
        isInstantExport = true;
        componentExportPath = path;
        classComponentPath = path.get('declaration');
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
        originalComponentName = path.node.id && path.node.id.name;
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
    },
    ReturnStatement(path) {
      if (!originalComponentName || closestHoCPath) {
        return;
      }

      if (isIdentifierInside(path, originalComponentName)) {
        componentReturnPath = path;
      }
    }
  });

  return {
    isDefaultExport,
    isExported: Boolean(componentExportPath),
    isHoC: Boolean(componentReturnPath),
    isInstantExport,
    exportedComponentName: exportedComponentName || originalComponentName,
    componentReturnPath,
    originalComponentName,
    componentExportPath,
    componentIdentifierInHoC,
    classComponentPath,
    closestHoCPath,
    functionalComponentPath
  };
};

module.exports = getComponentExportDetails;
