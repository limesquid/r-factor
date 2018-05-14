const generate = require('@babel/generator').default;
const { AbstractBuilder } = require('../model');
const { babelGeneratorOptions } = require('../options');
const { removeDoubleNewlines, removeTrailingWhitespace, squeezeCode } = require('../utils');

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
    code += this.buildPrefix();
    code += this.code.substring(this.node.start, this.node.end);
    if (this.staticFieldNode) {
      const body = this.buildClassBody();
      code = code.replace(this.getOldBody(), body);
    }
    code += this.buildSuffix();
    code = code.replace(this.getOldStaticField(), '');
    code = removeTrailingWhitespace(code);
    code = removeDoubleNewlines(code);
    return code;
  }

  buildClassBody() {
    let newBodyCode = '';
    newBodyCode += squeezeCode(this.buildStaticField(), 0, -2);
    newBodyCode += this.getOldBody();
    return newBodyCode;
  }

  buildStaticField() {
    if (!this.staticFieldNode) {
      return '';
    }

    const staticField = generate(this.staticFieldNode.expression.right, {
      ...babelGeneratorOptions,
      concise: false
    });
    return `static ${this.staticFieldName} = ${staticField.code};\n\n`;
  }

  getOldBody() {
    const body = this.node.body.body;
    const firstBodyEntry = body[0] || body;
    const lastBodyEntry = body[body.length - 1] || body;
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
