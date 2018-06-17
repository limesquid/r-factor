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
    this.defaultExportDeclarationPath = null;
    this.functionalComponentPath = null;
    this.componentExportPath = null;
    this.originalComponentName = '';
    this.newComponentName = '';
  }

  build() {
    if (!this.originalComponentName) {
      this.nameComponent();
    }

    if (this.componentExportPath) {
      this.removeExportStatement(this.componentExportPath);
    }

    if (!this.defaultExportDeclarationPath) {
      this.renameComponent();
    }

    this.appendConnect();

    return parser.print(this.ast);
  }

  nameComponent() {
    const code = this.code
      .replace('export default class', 'class Component')
      .replace('export default', 'const Component =');
    console.log(code);
    this.code = code;
    this.ast = parser.parse(code);
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

    // console.log(code);

    return parser.parse(code).program.body;
  }

  appendConnect(node) {
    const connectAst = this.buildConnectAst(this.newComponentName);
    const lastDeclaration = this.ast.program.body[this.ast.program.body.length - 1];
    this.ast.program.body.push(...connectAst);
  }

  removeExportStatement(path) {
    if (this.originalComponentName) {
      path.replaceWith(path.node.declaration);
    } else {
      path.replaceWith(
        t.variableDeclaration(
          'const',
          [
            t.variableDeclarator(
              t.identifier('Component'),
              path.node.declaration
            )
          ]
        )
      )
    }
  }

  renameComponent() {
    const { connectedComponentNamePattern: namePattern } = settings;
    this.newComponentName = namePattern.replace('${name}', this.originalComponentName);
    this.functionalComponentPath.scope.rename(this.originalComponentName, this.newComponentName);
  }

  setIsDefaultExport(isDefaultExport) {
    this.isDefaultExport = isDefaultExport;
  }

  setFunctionalComponentPath(path) {
    this.functionalComponentPath = path;
  }

  setComponentExportPath(path) {
    this.componentExportPath = path;
  }

  setOriginalComponentName(name) {
    this.originalComponentName = name;
    this.newComponentName = name;
  }

  setDefaultExportDeclarationPath(path) {
    this.defaultExportDeclarationPath = path;
  }
}

module.exports = ComponentBuilder;
