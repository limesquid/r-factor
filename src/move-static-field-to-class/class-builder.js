const generate = require('@babel/generator').default;
const { AbstractBuilder } = require('../model');
const { babelGeneratorOptions } = require('../options');
const { indentCode, removeDoubleNewlines, removeTrailingWhitespace, squeezeCode } = require('../utils');

class ClassBuilder extends AbstractBuilder {
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
    let body = '';
    code += this.buildPrefix();
    code += this.code.substring(this.node.start, this.node.end);
    if (this.staticFieldNode) {
      if (this.node.body.body.length === 0) {
        body += '{\n';
        body += squeezeCode(`${this.buildClassBody()}\n`, 2);
        body += indentCode('}', -2);
      } else {
        body += this.buildClassBody();
      }
      code = code.replace(this.getOldBody(), body);
    }
    code += this.buildSuffix();
    code = code.replace(this.getOldStaticField(), '');
    code = removeTrailingWhitespace(code);
    code = removeDoubleNewlines(code);
    return code;
  }

  buildClassBody() {
    const body = this.node.body.body;
    let newBodyCode = '';
    newBodyCode += squeezeCode(this.buildStaticField(), 0, -2);
    if (body.length > 0) {
      newBodyCode += this.getOldBody();
    }
    return newBodyCode;
  }

  buildStaticField() {
    const staticField = generate(this.staticFieldNode.expression.right, {
      ...babelGeneratorOptions,
      concise: false
    });
    return `static ${this.staticFieldName} = ${staticField.code};\n\n`;
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

  setStaticFieldNode(node) {
    this.staticFieldNode = node;
  }
}

module.exports = ClassBuilder;
