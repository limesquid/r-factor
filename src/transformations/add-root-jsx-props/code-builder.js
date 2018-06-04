const { Builder } = require('../../model');
const { cleanUpCode, generateIndent } = require('../../utils');
const { getNodeIndent } = require('../../utils/ast');

class CodeBuilder extends Builder {
  constructor(code, node) {
    super(code, node);
    this.key = null;
    this.value = null;
  }

  build() {
    const { openingElement } = this.node;
    const existingAttribute = this.getExistingAttribute();
    let code = '';

    if (existingAttribute) {
      code += this.code.substring(0, existingAttribute.value.start);
      code += `{${this.value}}`;
      code += this.code.substring(existingAttribute.value.end);
    } else {
      if (this.isMultiLine()) {

      } else {
        code += this.code.substring(0, openingElement.start);
        code += `<${openingElement.name.name} ${this.key}={${this.value}}>`;
        code += this.code.substring(openingElement.end);
      }
    }

    code = cleanUpCode(code);
    return code;
  }

  getExistingAttribute() {
    const attributes = this.node.openingElement.attributes;
    return attributes.find(({ name }) => name.name === this.key);
  }

  isMultiLine() {
    const attributes = this.node.openingElement.attributes;
    if (attributes.length === 0) {
      return false;
    }

    const firstAttribute = attributes[0];
    const lastAttribute = attributes[attributes.length - 1];
    return firstAttribute.loc.start.line !== lastAttribute.loc.end.line;
  }

  setProp(key, value) {
    this.key = key;
    this.value = value;
  }
}

module.exports = CodeBuilder;
