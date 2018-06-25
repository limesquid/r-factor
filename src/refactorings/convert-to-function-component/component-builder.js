const { Builder } = require('../../model');
const settings = require('../../settings');
const { cleanUpCode, indentCode, squeezeCode } = require('../../utils');
const { isExportDefaultArrowComponentDeclaration } = require('../../utils/ast');

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
    if (isExportDefaultArrowComponentDeclaration(this.node)) {
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
    if (isExportDefaultArrowComponentDeclaration(this.node)) {
      return `export default ${declaration}`;
    }
    return declaration;
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

  returnsJsxImmediately() {
    const init = this.getDeclarationInit();
    if (init) {
      return [ 'JSXElement', 'JSXFragment' ].includes(init.body.type);
    }
    return false;
  }
}

module.exports = ComponentBuilder;
