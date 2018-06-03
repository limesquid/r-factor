const { Builder } = require('../../model');
const { cleanUpCode, indentCode, sortPropTypes, squeezeCode } = require('../../utils');
const { getNodeIndent } = require('../../utils/ast');
const { insertCodeBelowNode } = require('../../transformations');

class ClassBuilder extends Builder {
  build() {
    return cleanUpCode(
      this.propTypesNode
        ? this.buildCodeWithExistingPropTypes()
        : this.buildCodeWithNewPropTypes()
    );
  }

  buildPropTypesContent(propTypes) {
    return sortPropTypes(this.buildPropTypesLines(propTypes)).join(',\n');
  }

  buildPropTypesLines(propTypes) {
    return Object.keys(propTypes).map((key) => `${key}: ${propTypes[key]}`);
  }

  buildCodeWithExistingPropTypes() {
    const definedPropsFirstPropNode = this.propTypesNode.properties[0];
    let indent = getNodeIndent(this.node) + 2;
    if (definedPropsFirstPropNode) {
      indent = getNodeIndent(definedPropsFirstPropNode);
    }
    const propTypesFirstLine = this.propTypesNode.loc.start.line;
    const propTypesLastLine = this.propTypesNode.loc.end.line - 1;
    const codeLines = this.code.split('\n');
    const definedPropTypesLines = codeLines.slice(propTypesFirstLine, propTypesLastLine);
    const allPropTypesLines = [
      this.buildPropTypesContent(this.newPropTypes),
      ...definedPropTypesLines.map((line) => line.trim().replace(/,$/, ''))
    ];
    const allPropTypesCode = sortPropTypes(allPropTypesLines).join(',\n');

    let code = '';
    code += codeLines.slice(0, propTypesFirstLine).join('\n');
    code += '\n';
    code += indentCode(allPropTypesCode, indent);
    code += '\n';
    code += codeLines.slice(propTypesLastLine).join('\n');

    return code;
  }

  buildCodeWithNewPropTypes() {
    const propTypesContent = this.buildPropTypesContent(this.newPropTypes);
    const indent = getNodeIndent(this.node)

    let propTypesCode = '';
    propTypesCode += '\n';
    propTypesCode += `${this.componentName}.propTypes = {\n`;
    propTypesCode += indentCode(propTypesContent, 2);
    propTypesCode += '\n};\n';
    propTypesCode = indentCode(propTypesCode, indent);

    return insertCodeBelowNode(this.code, this.node, propTypesCode);
  }

  setComponentName(name) {
    this.componentName = name;
  }

  setComponentType(type) {
    this.componentType = type;
  }

  setPropTypesObjectNode(node) {
    this.propTypesNode = node;
  }

  setNewPropTypes(propTypes) {
    this.newPropTypes = propTypes;
  }
}

module.exports = ClassBuilder;
