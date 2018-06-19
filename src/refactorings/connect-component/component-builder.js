const t = require('@babel/types');
const { Builder } = require('../../model');
const parser = require('../../utils/parser');
const settings = require('../../settings');

class ComponentBuilder extends Builder {
  constructor(code, ast) {
    super(code);
    this.ast = ast;
    this.isDefaultExport = false;
    this.isInstantExport = false;
    this.classComponentPath = null;
    this.componentExportPath = null;
    this.functionalComponentPath = null;
    this.originalComponentName = '';
    this.newComponentName = 'Component';
  }

  build() {
    const isExported = Boolean(this.componentExportPath);

    if (isExported) {
      this.removeExportStatement();
    }

    if (!this.isDefaultExport) {
      this.renameComponent();
    }

    this.appendConnect(isExported);

    return parser.print(this.ast) + (isExported ? settings.endOfLine : '');
  }

  buildConnectAst(isExported) {
    const { semicolon, doubleEndOfLine } = settings;
    let code = '';
    code += doubleEndOfLine;
    code += `const mapStateToProps = (state) => ({})${semicolon}`;
    code += doubleEndOfLine;
    code += `const mapDispatchToProps = {}${semicolon}`;
    code += doubleEndOfLine;

    const connectCode = `connect(mapStateToProps, mapDispatchToProps)(${this.newComponentName})${semicolon}`;
    if (isExported) {
      if (this.isDefaultExport) {
        code += `export default ${connectCode}`;
      } else {
        code += `export const ${this.originalComponentName} = ${connectCode}`;
      }
    }

    return [
      ...parser.parse(code).program.body,
      !isExported && t.returnStatement(parser.parse(connectCode).program.body[0].expression)
    ].filter(Boolean);
  }

  appendConnect(isExported) {
    const connectAst = this.buildConnectAst(isExported);
    const componentPath = this.functionalComponentPath || this.classComponentPath || this.componentExportPath;
    const componentScopeBodyNode = componentPath.findParent(
      ({ node }) => t.isBlockStatement(node) || t.isProgram(node)
    ).node;
    const blockStatementBodyNode = componentScopeBodyNode.body;
    if (!isExported) {
      componentScopeBodyNode.body = blockStatementBodyNode.filter((node) => !t.isReturnStatement(node));
    }
    componentScopeBodyNode.body.push(...connectAst);
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

  setIsDefaultExport(isDefaultExport) {
    this.isDefaultExport = isDefaultExport;
  }

  setIsInstantExport(isInstantExport) {
    this.isInstantExport = isInstantExport;
  }

  setFunctionalComponentPath(path) {
    this.functionalComponentPath = path;
  }

  setClassComponentPath(path) {
    this.classComponentPath = path;
  }

  setComponentExportPath(path) {
    this.componentExportPath = path;
  }

  setOriginalComponentName(name) {
    this.originalComponentName = name;
    this.newComponentName = name;
  }
}

module.exports = ComponentBuilder;
