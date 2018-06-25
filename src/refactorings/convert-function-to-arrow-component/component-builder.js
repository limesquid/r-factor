const { Builder } = require('../../model');
const settings = require('../../settings');
const { cleanUpCode, indentCode, squeezeCode } = require('../../utils');

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
    code += indentCode(this.isSingleReturnStatement() ? ')' : '}', indent);
    code += settings.semicolon;
    code += this.buildSuffix();
    code = cleanUpCode(code);
    return code;
  }

  buildBody() {
    const indent = this.getIndent();
    const body = this.node.body;

    if (this.isSingleReturnStatement()) {
      const jsx = body.body[0].argument;
      return squeezeCode(this.code.substring(jsx.start, jsx.end), settings.indent, -settings.indent - indent);
    }

    const firstNode = body.body[0];
    const lastNode = body.body[body.body.length - 1];
    return squeezeCode(this.code.substring(firstNode.start, lastNode.end), indent + settings.indent);
  }

  buildDeclaration() {
    const openParen = this.isSingleReturnStatement() ? '(' : '{';
    const name = this.buildName();
    const value = `(${this.buildProps()}) => ${openParen}`;
    if (name) {
      return `const ${name} = ${value}`;
    }
    return value;
  }

  buildName() {
    if (this.node.id) {
      return this.node.id.name;
    }
    return '';
  }

  buildProps() {
    const { params } = this.node;
    if (params.length === 0) {
      return '';
    }
    const firstParam = params[0];
    const lastParam = params[params.length - 1];
    return this.code.substring(firstParam.start, lastParam.end);
  }

  isSingleReturnStatement() {
    const body = this.node.body.body;
    return body.length === 1 || body[0].type === 'ReturnStatement';
  }
}

module.exports = ComponentBuilder;
