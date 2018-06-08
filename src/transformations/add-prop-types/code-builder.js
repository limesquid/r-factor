const { Builder } = require('../../model');
const settings = require('../../settings');
const { cleanUpCode, indentCode, sortPropTypes } = require('../../utils');
const { getNodeIndent } = require('../../utils/ast');
const insertCodeBelowNode = require('../insert-code-below-node');
const addImportDeclaration = require('../add-import-declaration');

class ClassBuilder extends Builder {
  build() {
    const code = this.propTypesObjectNode
      ? this.buildCodeWithExistingPropTypes()
      : this.buildCodeWithNewPropTypes();
    const codeWithImport = addImportDeclaration(code, this.node, {
      module: 'prop-types',
      identifier: 'PropTypes'
    });
    return cleanUpCode(codeWithImport);
  }

  buildPropTypesContent(propTypes) {
    return sortPropTypes(this.buildPropTypesLines(propTypes)).join(`,${settings.endOfLine}`);
  }

  buildPropTypesLines(propTypes) {
    return Object.keys(propTypes).map((key) => `${key}: ${propTypes[key]}`);
  }

  buildCodeWithExistingPropTypes() {
    const definedPropsFirstPropNode = this.propTypesObjectNode.properties[0];
    let indent = getNodeIndent(this.componentNode) + settings.indent;
    if (definedPropsFirstPropNode) {
      indent = getNodeIndent(definedPropsFirstPropNode);
    } else {
      indent = getNodeIndent(this.propTypesNode) + settings.indent;
    }
    const propTypesFirstLine = this.propTypesObjectNode.loc.start.line;
    const propTypesLastLine = this.propTypesObjectNode.loc.end.line - 1;
    const codeLines = this.code.split(settings.endOfLine);
    const definedPropTypesLines = codeLines
      .slice(propTypesFirstLine, propTypesLastLine)
      .filter((line) => !line.match(/^\s*$/));
    const undefinedPropTypes = this.getUndefinedPropTypes();
    const allPropTypesLines = [
      ...this.buildPropTypesContent(undefinedPropTypes).split(`,${settings.endOfLine}`),
      ...definedPropTypesLines.map((line) => line.trim().replace(/,$/, ''))
    ].filter(Boolean);
    const allPropTypesCode = sortPropTypes(allPropTypesLines).join(`,${settings.endOfLine}`);
    const sameLines = propTypesFirstLine === propTypesLastLine + 1;

    let code = '';
    code += codeLines.slice(0, propTypesFirstLine).join(settings.endOfLine);
    code += settings.endOfLine;
    code += indentCode(allPropTypesCode, indent);
    code += settings.endOfLine;
    code += codeLines.slice(propTypesLastLine + (sameLines ? 1 : 0)).join(settings.endOfLine);

    return code;
  }

  buildCodeWithNewPropTypes() {
    const propTypesContent = this.buildPropTypesContent(this.newPropTypes);
    const indent = getNodeIndent(this.componentNode);

    let propTypesCode = '';
    propTypesCode += settings.endOfLine;
    propTypesCode += `${this.componentName}.propTypes = {${settings.endOfLine}`;
    propTypesCode += indentCode(propTypesContent, settings.indent);
    propTypesCode += `${settings.endOfLine}}${settings.semicolon}${settings.endOfLine}`;
    propTypesCode = indentCode(propTypesCode, indent);

    return insertCodeBelowNode(this.code, this.componentNode, propTypesCode);
  }

  getUndefinedPropTypes() {
    const undefinedPropTypesKeys = Object.keys(this.newPropTypes).filter(
      (key) => !this.propTypesObjectNode.properties.find(
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

  setPropTypesNode(node) {
    this.propTypesNode = node;
  }

  setPropTypesObjectNode(node) {
    this.propTypesObjectNode = node;
  }

  setNewPropTypes(propTypes) {
    this.newPropTypes = propTypes;
  }
}

module.exports = ClassBuilder;
