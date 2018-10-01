const { Builder } = require('../../model');
const settings = require('../../settings');
const { cleanUpCode, indentCode, squeezeCode } = require('../../utils');

class ComponentBuilder extends Builder {
  build() {
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
    code = this.ensureProperExport(code);
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


  isSingleReturnStatement() {
    const body = this.node.body.body;
    return body.length === 1 || body[0].type === 'ReturnStatement';
  }
}

module.exports = ComponentBuilder;
