const { Builder } = require('../../model');
const settings = require('../../settings');
const { cleanUpCode, squeezeCode } = require('../../utils');
const { print } = require('../../utils/parser');

class ClassBuilder extends Builder {
  constructor(code, staticFieldName) {
    super(code);
    this.staticFieldName = staticFieldName;
    this.staticFieldNode = null;
  }

  build() {
    if (!this.node) {
      return this.code;
    }

    let code = '';
    code += this.buildPrefix();
    code += this.code.substring(this.node.start, this.node.end);
    if (this.staticFieldNode) {
      const oldBody = this.getOldBody();
      const newBody = this.buildBody();
      code = code.replace(oldBody, newBody);
    }
    code += this.buildSuffix();
    code = code.replace(this.getOldStaticField(), '');
    code = cleanUpCode(code);
    return code;
  }

  buildBody() {
    let body = '';
    if (this.isClassBodyEmpty()) {
      body += `{${settings.endOfLine}`;
      body += squeezeCode(this.buildClassBody(), settings.indent);
      body += `${settings.endOfLine}}`;
    } else {
      body += this.buildClassBody();
    }
    return body;
  }

  buildClassBody() {
    const indent = this.getIndent();
    const body = this.node.body.body;
    let newBodyCode = '';
    newBodyCode += squeezeCode(this.buildStaticField(), 0, settings.indent + indent);
    if (body.length > 0) {
      newBodyCode += this.getOldBody();
    }
    return newBodyCode;
  }

  buildStaticField() {
    const staticFieldCode = print(this.staticFieldNode.expression.right);
    const left = `static ${this.staticFieldName}`;
    const right = `${staticFieldCode}${settings.semicolon}${settings.doubleEndOfLine}`;
    return `${left} = ${right}`;
  }

  getOldBody() {
    const body = this.node.body.body;
    if (body.length === 0) {
      return this.code.substring(this.node.body.start, this.node.body.end);
    }
    const firstBodyEntry = body[0];
    const lastBodyEntry = body[body.length - 1];
    const bodyCode = this.code.substring(firstBodyEntry.start, lastBodyEntry.end);
    return bodyCode;
  }

  getOldStaticField() {
    if (!this.staticFieldNode) {
      return '';
    }

    return this.code.substring(this.staticFieldNode.start, this.staticFieldNode.end);
  }

  isClassBodyEmpty() {
    return this.node.body.body.length === 0;
  }

  setStaticFieldNode(node) {
    this.staticFieldNode = node;
  }
}

module.exports = ClassBuilder;
