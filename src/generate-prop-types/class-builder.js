const difference = require('lodash.difference');
const { Builder } = require('../model');
const { indentCode, sortPropTypes } = require('../utils');
const { getObjectExpressionKeys, getNodeIndent } = require('../utils/ast');
const insertCodeBelowNode = require('../transformations/insert-code-below-node');

class ClassBuilder extends Builder {
  setComponentName(name) {
    this.componentName = name;
  }

  setComponentType(type) {
    this.setComponentType = type;
  }

  setComponentNode(node) {
    this.componentNode = node;
  }

  setPropTypesObjectNode(node) {
    this.propTypesObjectNode = node;
  }

  setPropTypesObjectNodePath(path) {
    this.propTypesObjectNodePath = path;
  }

  setUsedProps(props) {
    this.usedProps = props;
  }

  getCodeWithNewPropTypesCreated() {
    let propTypesCode = '';
    const propTypesContent = this.generatePropTypesContent(this.usedProps);

    propTypesCode += '\n';
    propTypesCode += `${this.componentName}.propTypes = {\n`;
    propTypesCode += indentCode(propTypesContent, 2);
    propTypesCode += '\n};\n';

    return insertCodeBelowNode(this.code, this.componentNode, propTypesCode);
  }

  generatePropTypesLines(props) {
    return props.map((prop) => `${prop}: PropTypes.any`);
  }

  generatePropTypesContent(props) {
    return sortPropTypes(this.generatePropTypesLines(props)).join(',\n');
  }

  getCodeWithExistingPropTypesUpdated() {
    const definedProps = getObjectExpressionKeys(this.propTypesObjectNode);
    const undefinedProps = difference(this.usedProps, definedProps);
    const definedPropsFirstPropNode = this.propTypesObjectNode.properties[0];
    const propTypesIndent = getNodeIndent(definedPropsFirstPropNode);
    const propTypesFirstLine = this.propTypesObjectNode.loc.start.line;
    const propTypesLastLine = this.propTypesObjectNode.loc.end.line - 1;
    const codeLines = this.code.split('\n');
    const definedPropTypesLines = codeLines.slice(
      propTypesFirstLine,
      propTypesLastLine
    );
    const allPropTypesLines = [
      ...this.generatePropTypesLines(undefinedProps),
      ...definedPropTypesLines.map((line) => line.trim().replace(/,$/, ''))
    ];
    const allPropTypesCode = sortPropTypes(allPropTypesLines).join(',\n');

    let code = '';
    code += codeLines.slice(0, propTypesFirstLine).join('\n');
    code += '\n';
    code += indentCode(allPropTypesCode, propTypesIndent);
    code += '\n';
    code += codeLines.slice(propTypesLastLine).join('\n');

    return code;
  }

  build() {
    return this.propTypesObjectNode
      ? this.getCodeWithExistingPropTypesUpdated()
      : this.getCodeWithNewPropTypesCreated();
  }
}

module.exports = ClassBuilder;
