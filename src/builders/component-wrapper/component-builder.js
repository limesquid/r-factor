const {
  identifier,
  callExpression,
  exportDefaultDeclaration
} = require('@babel/types');
const { Builder } = require('../../model');
const parser = require('../../utils/parser');
const settings = require('../../settings');

class ComponentBuilder extends Builder {
  constructor(code, ast) {
    super(code);
    this.ast = ast;
  }

  setDetails(details) {
    this.isDefaultExport = details.isDefaultExport;
    this.isInstantExport = details.isInstantExport;
    this.classComponentPath = details.classComponentPath;
    this.componentExportPath = details.componentExportPath;
    this.functionalComponentPath = details.functionalComponentPath;
    this.originalComponentName = details.originalComponentName;
    this.newComponentName = 'Component';
  }

  setWrapperDetails({ name, invoke, outermost }) {

  }

  build() {
    const isExported = Boolean(this.componentExportPath);

    if (isExported) {
      this.removeExportStatement();
    }

    if (!this.isDefaultExport) {
      this.renameComponent();
    }

    this.wrap();

    return parser.print(this.ast) + (isExported ? settings.endOfLine : '');
  }

  removeExportStatement() {
    if (!this.isInstantExport) {
      this.componentExportPath.remove();
      return;
    }

    const componentDeclaration = this.componentExportPath.node.declaration;

    if (this.originalComponentName) {
      this.componentExportPath.replaceWith(componentDeclaration);
      return;
    }

    const componentCode = `const Component = ${this.code.slice(componentDeclaration.start, componentDeclaration.end)}`;
    this.componentExportPath.replaceWith(
      parser.parse(componentCode).program.body[0]
    );
  }

  renameComponent() {
    if (!this.componentExportPath) {
      return;
    }

    const { connectedComponentNamePattern: namePattern } = settings;
    this.newComponentName = namePattern.replace('${name}', this.originalComponentName);
    if (this.functionalComponentPath) {
      this.functionalComponentPath.scope.rename(this.originalComponentName, this.newComponentName);
    } else {
      this.classComponentPath.scope.rename(this.originalComponentName, this.newComponentName);
    }
  }

  wrap(isExported) {
    let ast = null;

    const hocAst = callExpression(identifier('withRouter'), [
      identifier(this.newComponentName)
    ]);

    if (this.isDefaultExport) {
      ast = exportDefaultDeclaration(hocAst);
    }

    this.componentExportPath.insertAfter(ast);
  }
}

module.exports = ComponentBuilder;
