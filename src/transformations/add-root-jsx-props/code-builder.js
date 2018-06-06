const { Builder } = require('../../model');
const { cleanUpCode, indentCode, sortPropTypes } = require('../../utils');
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
    } else if (this.isMultiLine()) {
      code += this.code.substring(0, openingElement.start);
      code += `<${openingElement.name.name}\n`;
      code += indentCode(this.getNewAttributes(), getNodeIndent(openingElement) + 2);
      code += '>';
      code += this.code.substring(openingElement.end);
    } else {
      code += this.code.substring(0, openingElement.start);
      code += `<${openingElement.name.name} ${this.key}={${this.value}}>`;
      code += this.code.substring(openingElement.end);
    }

    code = cleanUpCode(code);
    return code;
  }

  getExistingAttribute() {
    const attributes = this.node.openingElement.attributes;
    return attributes.find(({ name }) => name.name === this.key);
  }

  getNewAttributes() {
    return sortPropTypes([
      ...this.node.openingElement.attributes.map(({ name, value }) => {
        if (value) {
          return `${name.name}=${this.code.substring(value.start, value.end)}`;
        }
        return `${name.name}`;
      }),
      `${this.key}={${this.value}}`
    ]).join('\n');
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
