const generate = require('@babel/generator').default;
const { Builder } = require('../../model');
const settings = require('../../settings');
const { babelGeneratorOptions } = require('../../options');
const { cleanUpCode, indentCode, squeezeCode } = require('../../utils');
const {
  getClassMethod,
  getReturnStatement,
  isExportDefaultFunctionalComponentDeclaration,
  isPropsDeclaration
} = require('../../utils/ast');

class ComponentBuilder extends Builder {
  build() {
    if (!this.node) {
      return this.code;
    }

    const indent = this.getIndent();
    let code = '';
    code += this.buildPrefix();
    code += this.buildDeclaration();
    code += settings.endOfLine;
    code += indentCode(this.buildBody(), indent);
    code += settings.endOfLine;
    code += indentCode('}', indent);
    if (isExportDefaultFunctionalComponentDeclaration(this.node)) {
      code += settings.semicolon;
    }
    code += this.buildSuffix();
    code = cleanUpCode(code);
    return code;
  }

  buildBody() {
    const indent = this.getIndent();
    const body = this.getDeclarationInit().body;

    if (this.returnsJsxImmediately()) {
      const bodyCode = squeezeCode(this.code.substring(body.start, body.end), settings.indent, -indent);
      const returnStatement = `return (${settings.endOfLine}${bodyCode}${settings.endOfLine})${settings.semicolon}`;
      return indentCode(returnStatement, settings.indent);
    }

    const firstNode = body.body[0];
    const lastNode = body.body[body.body.length - 1];
    return squeezeCode(this.code.substring(firstNode.start, lastNode.end), indent + settings.indent);
  }

  buildDeclaration() {
    const name = this.buildName();
    let declaration = `function(${this.buildProps()}) {`;
    if (name) {
      declaration = `function ${name}(${this.buildProps()}) {`;
    }
    if (isExportDefaultFunctionalComponentDeclaration(this.node)) {
      return `export default ${declaration}`;
    }
    return declaration;
  }

  buildBodyNonReturnStatements() {
    const render = getClassMethod(this.node, 'render');
    const bodyNodes = render.body.body;
    const firstNode = bodyNodes[0];
    const lastNonReturnNode = [ ...bodyNodes ].reverse().find((node) => node.type !== 'ReturnStatement');
    let code = this.code.substring(firstNode.start, lastNonReturnNode.end);
    code = indentCode(code, -settings.indent);
    return code;
  }

  buildJsx() {
    const jsxNode = this.getReturnStatementValue();
    return this.code.substring(jsxNode.start, jsxNode.end);
  }

  buildName() {
    if (this.getDeclaration()) {
      return this.getDeclaration().id.name;
    }
    return '';
  }

  buildProps() {
    const params = this.getDeclarationInit().params;
    const propsNode = params[0];
    if (params.length > 0) {
      return this.code.substring(propsNode.start, propsNode.end);
    }
    return '';
  }

  ensureProperExport(code) {
    const declarationCode = `const ${this.buildName()}`;
    const defaultExportCode = `export default ${declarationCode}`;
    let newCode = code;
    if (newCode.includes(defaultExportCode)) {
      newCode = newCode.replace(defaultExportCode, declarationCode);
      newCode += settings.endOfLine;
      newCode += `export default ${this.buildName()}${settings.semicolon}`;
      newCode += settings.endOfLine;
    }
    return newCode;
  }

  getDeclaration() {
    if (this.node.declarations) {
      return this.node.declarations[0];
    }
    return null;
  }

  getDeclarationInit() {
    const declaration = this.getDeclaration();
    if (declaration && declaration.init) {
      return declaration.init;
    }
    return this.node.declaration;
  }

  getOldPropsDeclaration() {
    const propsNode = this.getPropsNode();
    return this.code.substring(propsNode.start, propsNode.end);
  }

  getPropsDeclaration() {
    const propsNode = this.getPropsNode();
    return propsNode.declarations.find(isPropsDeclaration);
  }

  getPropsNode() {
    const render = getClassMethod(this.node, 'render');
    const bodyNodes = render.body.body;
    return bodyNodes.find(
      ({ type, declarations }) => type === 'VariableDeclaration' && declarations.find(isPropsDeclaration)
    );
  }

  getReturnStatementValue() {
    const render = getClassMethod(this.node, 'render');
    const returnStatement = getReturnStatement(render);
    return returnStatement.argument;
  }

  hasPropsDeclaration() {
    return Boolean(this.getPropsNode() && this.getPropsDeclaration());
  }

  returnsJsxImmediately() {
    const init = this.getDeclarationInit();
    if (init) {
      return [ 'JSXElement', 'JSXFragment' ].includes(init.body.type);
    }
    return false;
  }
}

module.exports = ComponentBuilder;
