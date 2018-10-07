const { Builder } = require('../../model');
const settings = require('../../settings');
const { arePropTypesSorted, cleanUpCode, indentCode, sortPropTypes, squeezeCode } = require('../../utils');
const { COMPONENT_TYPE } = require('../../constants');
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
    const propTypesIndent = getNodeIndent(this.propTypesNode);
    const indent = propTypesIndent + settings.indent;
    const propTypesFirstLineIndex = this.propTypesObjectNode.loc.start.line - 1;
    const propTypesLastLineIndex = this.propTypesObjectNode.loc.end.line - 1;
    const codeLines = this.code.split(settings.endOfLine);
    codeLines.splice(
      propTypesFirstLineIndex,
      propTypesLastLineIndex - propTypesFirstLineIndex + 1,
      codeLines[propTypesFirstLineIndex].match(/.*{/)[0],
      squeezeCode(`}${settings.semicolon}`, propTypesIndent, 0)
    );
    const definedPropTypesLines = this.propTypesObjectNode.properties
      .map((property) => this.code.slice(property.start, property.end))
      .map((line) => line.trim().replace(/,$/, ''))
      .filter(Boolean);
    const undefinedPropTypes = this.getUndefinedPropTypes();
    const undefinedPropTypesLines = this.buildPropTypesContent(undefinedPropTypes)
      .split(`,${settings.endOfLine}`)
      .filter(Boolean)
      .map(((propTypeLine) => squeezeCode(propTypeLine, 0, 0)));
    const allPropTypesLines = [ ...definedPropTypesLines, ...undefinedPropTypesLines ];
    const areDefinedPropTypesSorted = arePropTypesSorted(definedPropTypesLines);
    const allPropTypesCode = (areDefinedPropTypesSorted ? sortPropTypes(allPropTypesLines) : allPropTypesLines)
      .map((propTypeLine) => squeezeCode(propTypeLine, indent, 0))
      .join(`,${settings.endOfLine}`);

    let code = '';
    code += codeLines.slice(0, propTypesFirstLineIndex + 1).join(settings.endOfLine);
    code += settings.endOfLine;
    code += allPropTypesCode;
    code += settings.trailingComma;
    code += settings.endOfLine;
    code += codeLines.slice(propTypesFirstLineIndex + 1).join(settings.endOfLine);

    return code;
  }

  buildCodeWithNewPropTypes() {
    const propTypesContent = this.buildPropTypesContent(this.newPropTypes);
    const indent = this.componentType === COMPONENT_TYPE.Class
      ? getNodeIndent(this.componentNode.id)
      : getNodeIndent(this.componentNode);

    let propTypesCode = '';
    propTypesCode += settings.endOfLine;
    propTypesCode += `${this.componentName}.propTypes = {${settings.endOfLine}`;
    propTypesCode += indentCode(propTypesContent, settings.indent);
    propTypesCode += `${settings.endOfLine}}${settings.semicolon}`;
    propTypesCode = indentCode(propTypesCode, indent);
    propTypesCode += settings.endOfLine;

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
