const generate = require('@babel/generator').default;
const { AbstractBuilder } = require('../model');
const { babelGeneratorOptions } = require('../options');
const { indentCode, removeDoubleNewlines, removeTrailingWhitespace, squeezeCode } = require('../utils');
const { getClassMethod, getReturnStatement, isPropsDeclaration } = require('../node-utils');

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
      code += this.buildStaticField();
    }
    code += this.buildSuffix();
    code = code.replace(this.getOldStaticField(), '');
    code = removeTrailingWhitespace(code);
    code = removeDoubleNewlines(code);
    return code;
  }

  buildStaticField() {
    if (!this.staticFieldNode) {
      return '';
    }

    const staticField = generate(this.staticFieldNode.value, { ...babelGeneratorOptions, concise: false });
    return `\n\n${this.buildName()}.${this.staticFieldName} = ${staticField.code};\n\n`;
  }

  buildName() {
    return this.node.id.name;
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
