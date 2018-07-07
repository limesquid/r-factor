const traverse = require('@babel/traverse').default;
const { isIdentifier } = require('@babel/types');
const {
  isArrowComponentDeclaration,
  isArrowComponentExpressionPath,
  isArrowComponentExpression,
  isComponentDeclaration,
  isIdentifierInside
} = require('./ast');

class ComponentExportDetails {
  constructor(ast) {
    this.isDefaultExport = false;
    this.isInstantExport = false;
    this.isHoc = false;
    this.exportedComponentName = null;
    this.originalComponentName = null;
    this.componentExportPath = null;
    this.componentReturnPath = null;
    this.classComponentPath = null;
    this.arrowComponentDeclaration = null;
    this.arrowComponentExpressionPath = null;
    this.closestHocPath = null;
    this.componentIdentifierInHoc = null;

    this.gatherDetails(ast);
  }

  gatherDetails(ast) {
    // eslint-disable-next-line
    const that = this;

    traverse(ast, {
      ExportDefaultDeclaration(path) {
        const { node } = path;
        if (that.originalComponentName && isIdentifierInside(path, that.originalComponentName)) {
          that.isDefaultExport = true;
          that.isInstantExport = false;
          that.componentExportPath = path;
        }

        const isComponent = isComponentDeclaration(node.declaration);
        const isArrowComponent = isArrowComponentExpression(node.declaration);
        if (isComponent || isArrowComponent) {
          that.isDefaultExport = true;
          that.isInstantExport = true;
          that.componentExportPath = path;
        }

        if (isComponent) {
          that.classComponentPath = path.get('declaration');
        } else if (isArrowComponent) {
          that.arrowComponentDeclaration = path.get('declaration');
        }
      },
      ExportNamedDeclaration(path) {
        if (that.originalComponentName && isIdentifierInside(path, that.originalComponentName)) {
          that.componentExportPath = path;
          that.exportedComponentName = path.node.declaration.declarations[0].id.name;
          return;
        }

        const variableDeclaration = path.node.declaration;
        if (isArrowComponentDeclaration(variableDeclaration)) {
          that.isInstantExport = true;
          that.componentExportPath = path;
          that.arrowComponentDeclaration = path.get('declaration');
        }

        if (isComponentDeclaration(variableDeclaration)) {
          that.isInstantExport = true;
          that.componentExportPath = path;
          that.classComponentPath = path.get('declaration');
        }
      },
      VariableDeclaration(path) {
        if (isArrowComponentDeclaration(path.node)) {
          that.originalComponentName = path.node.declarations[0].id.name;
          that.arrowComponentDeclaration = path;
        }
      },
      ClassDeclaration(path) {
        if (isComponentDeclaration(path.node)) {
          that.originalComponentName = path.node.id && path.node.id.name;
          that.classComponentPath = path;
        }
      },
      enter(path) {
        if (!that.arrowComponentDeclaration && isArrowComponentExpressionPath(path)) {
          that.isHoc = true;
          that.arrowComponentExpressionPath = path;
          path.skip();
        }
      },
      CallExpression(path) {
        const { node } = path;
        if (!that.originalComponentName || that.closestHocPath) {
          return;
        }

        const componentIdentifier = node.arguments.find(
          (argument) => isIdentifier(argument, { name: that.originalComponentName })
        );
        if (componentIdentifier) {
          that.closestHocPath = path;
          that.componentIdentifierInHoc = componentIdentifier;
        }
      },
      ReturnStatement(path) {
        if (!that.originalComponentName || that.closestHocPath) {
          return;
        }

        if (isIdentifierInside(path, that.originalComponentName)) {
          that.isHoc = true;
          that.componentReturnPath = path;
        }
      }
    });
  }

  getDetails() {
    return {
      arrowComponentExpressionPath: this.arrowComponentExpressionPath,
      isDefaultExport: this.isDefaultExport,
      isExported: Boolean(this.componentExportPath),
      isHoc: this.isHoc,
      isInstantExport: this.isInstantExport,
      exportedComponentName: this.exportedComponentName || this.originalComponentName,
      componentReturnPath: this.componentReturnPath,
      originalComponentName: this.originalComponentName,
      componentExportPath: this.componentExportPath,
      componentIdentifierInHoc: this.componentIdentifierInHoc,
      classComponentPath: this.classComponentPath,
      closestHocPath: this.closestHocPath,
      arrowComponentDeclaration: this.arrowComponentDeclaration
    };
  }
}

module.exports = ComponentExportDetails;
