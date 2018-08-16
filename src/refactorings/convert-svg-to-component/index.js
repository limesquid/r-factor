const { Refactoring } = require('../../model');
const settings = require('../../settings');
const { generateIndent, indentCode } = require('../../utils');
const xmlParser = require('../../utils/xml-parser');
const ConvertToFunctionComponent = require('../convert-to-function-component');
const ConvertToClassComponent = require('../convert-to-class-component');
const SVG_ATTRIBUTES = require('./svg-attributes');

const convertToFunctionComponent = new ConvertToFunctionComponent();
const convertToClassComponent = new ConvertToClassComponent();

class ConvertSvgToComponent extends Refactoring {
  constructor() {
    super(xmlParser);
    this.transformations = [
      (code, jsXml) => {
        const arrowComponentCode = this.refactorSvg(code, jsXml);

        if (settings.svgComponentType === 'class') {
          return convertToClassComponent.refactor(arrowComponentCode);
        }

        if (settings.svgComponentType === 'function') {
          return convertToFunctionComponent.refactor(arrowComponentCode);
        }

        return arrowComponentCode;
      }
    ];
  }

  canApply() {
    return true;
  }

  refactorSvg(code, jsXml) {
    let component = 'import React from \'react\';';
    component += settings.doubleEndOfLine;
    component += `const ${settings.defaultComponentName} = () => (`;
    component += settings.endOfLine;
    component += indentCode(this.buildNode('svg', jsXml.svg), settings.indent);
    component += settings.endOfLine;
    component += `)${settings.semicolon}`;
    component += settings.doubleEndOfLine;
    component += `export default ${settings.defaultComponentName}${settings.semicolon}`;
    component += settings.endOfLine;
    return component;
  }

  buildNode(name, node, level = 0) {
    const attributes = this.buildAttributes(node);
    const children = this.buildChildren(node, level + 1);

    let builder = `<${name}`;

    if (attributes) {
      builder += ` ${attributes}`;
    }

    if (children) {
      const indent = generateIndent(level * settings.indent);
      builder += `>${settings.endOfLine}${children}${settings.endOfLine}${indent}</${name}>`;
    } else {
      builder += ' />';
    }

    return builder;
  }

  buildAttributes(node) {
    const attributesObject = node.$ || {};

    return Object.keys(attributesObject).map((key) => {
      const value = attributesObject[key];
      return `${SVG_ATTRIBUTES[key] || key}="${value}"`;
    }).join(' ');
  }

  buildChildren(node, level) {
    const childrenTags = Object.keys(node).filter((key) => key !== '$');

    return childrenTags.map((tag) => {
      const tagValue = node[tag];

      if (Array.isArray(tagValue)) {
        const indent = generateIndent(level * settings.indent);

        return tagValue.map((element) => {
          if (typeof element === 'string') {
            return `${indent}<${tag}>${element}</${tag}>`;
          }

          return `${indent}${this.buildNode(tag, element, level)}`;
        }).join(settings.endOfLine);
      }

      if (typeof tagValue === 'object') {
        return this.buildNode(tag, node, level + 1);
      }

      return '';
    }).join(settings.endOfLine);
  }
}

module.exports = ConvertSvgToComponent;
