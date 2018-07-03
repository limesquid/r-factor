const traverse = require('@babel/traverse').default;
const { isIdentifier } = require('@babel/types');
const {
  isArrowComponentDeclaration,
  isArrowComponentExpression,
  isComponentDeclaration,
  isExportDefaultArrowComponentDeclaration,
  isHocFunctionDeclaration,
  isIdentifierInside
} = require('./ast');

const getComponentExportDetails = (ast) => {
  let isDefaultExport = false;
  let isInstantExport = false;
  let isHoc = false;
  let exportedComponentName = null;
  let originalComponentName = null;
  let componentExportPath = null;
  let componentReturnPath = null;
  let classComponentPath = null;
  let arrowComponentDeclaration = null;
  let arrowComponentExpressionPath = null;
  let closestHocPath = null;
  let componentIdentifierInHoc = null;

  traverse(ast, {
    ExportDefaultDeclaration(path) {
      const { node } = path;
      if (originalComponentName && isIdentifierInside(path, originalComponentName)) {
        isDefaultExport = true;
        isInstantExport = false;
        componentExportPath = path;
      }

      const isComponent = isComponentDeclaration(node.declaration);
      const isArrowComponent = isArrowComponentExpression(node.declaration);
      if (isComponent || isArrowComponent) {
        isDefaultExport = true;
        isInstantExport = true;
        componentExportPath = path;
      }

      if (isComponent) {
        classComponentPath = path.get('declaration');
      } else if (isArrowComponent) {
        arrowComponentDeclaration = path.get('declaration');
      } 
    },
    ExportNamedDeclaration(path) {
      if (originalComponentName && isIdentifierInside(path, originalComponentName)) {
        componentExportPath = path;
        exportedComponentName = path.node.declaration.declarations[0].id.name;
        return;
      }

      const variableDeclaration = path.node.declaration;
      if (isArrowComponentDeclaration(variableDeclaration)) {
        isInstantExport = true;
        componentExportPath = path;
        arrowComponentDeclaration = path.get('declaration');
      }

      if (isComponentDeclaration(variableDeclaration)) {
        isInstantExport = true;
        componentExportPath = path;
        classComponentPath = path.get('declaration');
      }
    },
    VariableDeclaration(path) {
      // if (isHocFunctionDeclaration(path.node)) {
      //   isHoc = true;
      //   return;
      // }

      if (isArrowComponentDeclaration(path.node)) {
        originalComponentName = path.node.declarations[0].id.name;
        arrowComponentDeclaration = path;
      }
    },
    ClassDeclaration(path) {
      if (isComponentDeclaration(path.node)) {
        originalComponentName = path.node.id && path.node.id.name;
        classComponentPath = path;
      }
    },
    enter(path) {
      if (!arrowComponentDeclaration && isArrowComponentExpression(path.node)) {
        isHoc = true;
        arrowComponentExpressionPath = path;
      }
    },
    CallExpression(path) {
      const { node } = path;
      if (!originalComponentName || closestHocPath) {
        return;
      }

      const componentIdentifier = node.arguments.find(
        (argument) => isIdentifier(argument, { name: originalComponentName })
      );
      if (componentIdentifier) {
        closestHocPath = path;
        componentIdentifierInHoc = componentIdentifier;
      }
    },
    ReturnStatement(path) {
      if (!originalComponentName || closestHocPath) {
        return;
      }

      if (isIdentifierInside(path, originalComponentName)) {
        isHoc = true;
        componentReturnPath = path;
      }
    }
  });

  return {
    arrowComponentExpressionPath,
    isDefaultExport,
    isExported: Boolean(componentExportPath),
    isHoc,
    isInstantExport,
    exportedComponentName: exportedComponentName || originalComponentName,
    componentReturnPath,
    originalComponentName,
    componentExportPath,
    componentIdentifierInHoc,
    classComponentPath,
    closestHocPath,
    arrowComponentDeclaration
  };
};

module.exports = getComponentExportDetails;
