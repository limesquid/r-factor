const generate = require('@babel/generator').default;
const { Builder } = require('../../model');
const settings = require('../../settings');
const { babelGeneratorOptions } = require('../../options');
const { cleanUpCode, indentCode } = require('../../utils');

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

    const indent = this.getIndent();
    let code = '';
    code += this.buildPrefix();
    code += this.code.substring(this.node.start, this.node.end);
    if (this.staticFieldNode) {
      code += indentCode(this.buildStaticField(), indent);
      if (this.node.body.body.length === 1) {
        code = code.replace(this.getOldBody(), `{${settings.endOfLine}}`);
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
    const left = `${settings.doubleEndOfLine}${this.buildName()}.${this.staticFieldName}`;
    const right = `${staticField.code};${settings.doubleEndOfLine}`;
    return `${left} = ${right}`;
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
