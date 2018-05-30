const generate = require('@babel/generator').default;
const { AbstractBuilder } = require('../model');
const { babelGeneratorOptions } = require('../options');
const { cleanUpCode, indentCode } = require('../utils');

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

    const indent = this.getIndent();
    let code = '';
    code += this.buildPrefix();
    code += this.code.substring(this.node.start, this.node.end);
    if (this.staticFieldNode) {
      code += indentCode(this.buildStaticField(), indent);
      if (this.node.body.body.length === 1) {
        code = code.replace(this.getOldBody(), '{\n}');
      } else {
        code = code.replace(this.getOldStaticField(), '');
      }
    }
    code += this.buildSuffix();
    code = cleanUpCode(code);
    return code;
  }

  buildStaticField() {
    const staticField = generate(this.staticFieldNode.value, {
      ...babelGeneratorOptions,
      concise: false
    });
    return `\n\n${this.buildName()}.${this.staticFieldName} = ${staticField.code};\n\n`;
  }

  buildName() {
    return this.node.id.name;
  }

  getOldBody() {
    return this.code.substring(this.node.body.start, this.node.body.end);
  }

  getOldStaticField() {
    return this.code.substring(this.staticFieldNode.start, this.staticFieldNode.end);
  }

  setStaticFieldNode(node) {
    this.staticFieldNode = node;
  }
}

module.exports = ClassBuilder;
