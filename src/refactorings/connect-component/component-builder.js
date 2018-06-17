const generate = require('@babel/generator').default;
const template = require('@babel/template').default;
const t = require('@babel/types');
const { Builder } = require('../../model');
const parser = require('../../utils/parser');
const settings = require('../../settings');
const { babelGeneratorOptions } = require('../../options');
const { cleanUpCode, indentCode, squeezeCode } = require('../../utils');
const { getClassMethod, getReturnStatement, isPropsDeclaration } = require('../../utils/ast');

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
    this.removeExportStatement();

    if (!this.isDefaultExport) {
      this.renameComponent();
    }

    this.appendConnect();

    return parser.print(this.ast);
  }

  buildConnectAst() {
    const { semicolon, endOfLine, doubleEndOfLine } = settings;
    let code = '';
    code += doubleEndOfLine;
    code += 'const mapStateToProps = (state) => ({})' + semicolon;
    code += doubleEndOfLine;
    code += 'const mapDispatchToProps = {}' + semicolon;
    code += doubleEndOfLine;

    const connectCode = `connect(mapStateToProps, mapDispatchToProps)(${this.newComponentName})` + semicolon;
    if(this.isDefaultExport) {
      code += `export default ${connectCode}`;
    } else {
      code += `export const ${this.originalComponentName} = ${connectCode}`;
    }

    return parser.parse(code).program.body;
  }

  appendConnect(node) {
    const connectAst = this.buildConnectAst(this.newComponentName);
    const lastDeclaration = this.ast.program.body[this.ast.program.body.length - 1];
    this.ast.program.body.push(...connectAst);
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

    const componentCode = 'const Component = ' + this.code.slice(componentDeclaration.start, componentDeclaration.end);
    this.componentExportPath.replaceWith(
      parser.parse(componentCode).program.body[0]
    );
  }

  renameComponent() {
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
