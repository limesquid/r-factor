const { Builder } = require('../../model');
const { cleanUpCode, indentCode, sortPropTypes } = require('../../utils');
const { getNodeIndent } = require('../../utils/ast');
const insertCodeBelowNode = require('../insert-code-below-node');
const addImportDeclaration = require('../add-import-declaration');

class ClassBuilder extends Builder {
  build() {
    const code = this.propTypesNode
      ? this.buildCodeWithExistingPropTypes()
      : this.buildCodeWithNewPropTypes();
    const codeWithImport = addImportDeclaration(code, this.node, {
      module: 'prop-types',
      identifier: 'PropTypes'
    });
    return cleanUpCode(codeWithImport);
  }

  buildPropTypesContent(propTypes) {
    return sortPropTypes(this.buildPropTypesLines(propTypes)).join(',\n');
  }

  buildPropTypesLines(propTypes) {
    return Object.keys(propTypes).map((key) => `${key}: ${propTypes[key]}`);
  }

  buildCodeWithExistingPropTypes() {
    const definedPropsFirstPropNode = this.propTypesNode.properties[0];
    let indent = getNodeIndent(this.componentNode) + 2;
    if (definedPropsFirstPropNode) {
      indent = getNodeIndent(definedPropsFirstPropNode);
    }
    const propTypesFirstLine = this.propTypesNode.loc.start.line;
    const propTypesLastLine = this.propTypesNode.loc.end.line - 1;
    const codeLines = this.code.split('\n');
    const definedPropTypesLines = codeLines
      .slice(propTypesFirstLine, propTypesLastLine)
      .filter((line) => !line.match(/^\s*$/));
    const undefinedPropTypes = this.getUndefinedPropTypes();
    const allPropTypesLines = [
      this.buildPropTypesContent(undefinedPropTypes),
      ...definedPropTypesLines.map((line) => line.trim().replace(/,$/, ''))
    ].filter(Boolean);
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
    const indent = getNodeIndent(this.componentNode);

    let propTypesCode = '';
    propTypesCode += '\n';
    propTypesCode += `${this.componentName}.propTypes = {\n`;
    propTypesCode += indentCode(propTypesContent, 2);
    propTypesCode += '\n};\n';
    propTypesCode = indentCode(propTypesCode, indent);

    return insertCodeBelowNode(this.code, this.componentNode, propTypesCode);
  }

  getUndefinedPropTypes() {
    const undefinedPropTypesKeys = Object.keys(this.newPropTypes).filter(
      (key) => !this.propTypesNode.properties.find(
        (property) => property.key.name === key
      )
    );
    const undefinedPropTypes = undefinedPropTypesKeys.reduce(
      (propTypes, key) => ({
        ...propTypes,
        [key]: this.newPropTypes[key]
      }),
      {}
    );
    return undefinedPropTypes;
  }

  setComponentName(name) {
    this.componentName = name;
  }

  setComponentNode(node) {
    this.componentNode = node;
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
