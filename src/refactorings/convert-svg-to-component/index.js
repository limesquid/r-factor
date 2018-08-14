/* TODO */
// specjalne handlowanie atrybutu "style" - string na obiekt

const { Refactoring } = require('../../model');
const settings = require('../../settings');
const { generateIndent } = require('../../utils');
const xmlParser = require('../../utils/xml-parser');
const SVG_ATTRIBUTES = require('./svg-attributes');

class ConvertSvgToComponent extends Refactoring {
  constructor() {
    super(xmlParser);
    this.transformations = [
      (code, jsXml) => this.refactorSvg(code, jsXml)
    ];
  }

  canApply() {
    return true;
  }

  refactorSvg(code, jsXml) {
    return this.buildNode('svg', jsXml.svg);
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
        const firstElement = tagValue[0];
        if (typeof firstElement === 'string') {
          return `${generateIndent(level * settings.indent)}<${tag}>${firstElement}</${tag}>`;
        }
        return `${generateIndent(level * settings.indent)}${this.buildNode(tag, firstElement, level)}`;
      } else if (typeof tagValue === 'object') {
        return this.buildNode(tag, node, level + 1);
      }
      return '';
    }).join(settings.endOfLine);
  }
}

module.exports = ConvertSvgToComponent;
