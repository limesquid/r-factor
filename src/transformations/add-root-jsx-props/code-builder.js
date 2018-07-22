const { Builder } = require('../../model');
const settings = require('../../settings');
const { cleanUpCode, indentCode, isString, sortPropTypes } = require('../../utils');
const { getNodeIndent } = require('../../utils/ast');
const { print } = require('../../utils/parser');

class CodeBuilder extends Builder {
  constructor(code) {
    super(code);
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
      code += this.code.substring(0, openingElement.start);
      code += '<';
      code += this.code.substring(openingElement.name.start, openingElement.name.end);
      if (this.isMultiLine()) {
        code += settings.endOfLine;
        code += indentCode(
          this.getNewAttributes().join(settings.endOfLine),
          getNodeIndent(openingElement) + settings.indent
        );
      } else {
        code += ' ';
        code += this.getNewAttributes().join(' ');
      }
      code += openingElement.selfClosing ? ' /' : '';
      code += '>';
      code += this.code.substring(openingElement.end);
    }

    code = cleanUpCode(code);
    return code;
  }

  getExistingAttribute() {
    const attributes = this.node.openingElement.attributes;
    return attributes.find(({ name }) => name && name.name === this.key);
  }

  getNewAttributes() {
    let newAttribute = `${this.key}`;

    if (isString(this.value)) {
      newAttribute += `=${this.value}`;
    } else if (this.value !== true) {
      newAttribute += `={${this.value}}`;
    }

    return sortPropTypes([
      ...this.node.openingElement.attributes.map(({ argument, name, type, value }) => {
        if (type === 'JSXSpreadAttribute') {
          return `{...${print(argument)}}`;
        }
        if (value) {
          return `${name.name}=${this.code.substring(value.start, value.end)}`;
        }
        return `${name.name}`;
      }),
      newAttribute
    ]);
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
