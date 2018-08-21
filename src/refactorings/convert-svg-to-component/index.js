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
    const { namespace, svgNode } = this.getSvgWithNamespace(jsXml);
    if (namespace) {
      svgNode.$.xmlns = svgNode.$.xmlns || svgNode.$[`xmlns:${namespace}`];
      Reflect.deleteProperty(svgNode, `xmlns:${namespace}`);
    }
    let component = 'import React from \'react\';';
    component += settings.doubleEndOfLine;
    component += `const ${settings.defaultComponentName} = () => (`;
    component += settings.endOfLine;
    component += indentCode(this.buildNode(namespace, 'svg', svgNode), settings.indent);
    component += settings.endOfLine;
    component += `)${settings.semicolon}`;
    component += settings.doubleEndOfLine;
    component += `export default ${settings.defaultComponentName}${settings.semicolon}`;
    component += settings.endOfLine;
    return component;
  }

  getSvgWithNamespace(rootNode) {
    const svgNodeName = Object.keys(rootNode)[0];
    const svgNode = rootNode[svgNodeName];
    const namespace = this.getKeyNamespace(svgNodeName);
    return { namespace, svgNode };
  }

  getKeyNamespace(key) {
    return key.substring(0, key.indexOf(':'));
  }

  getKeyName(key) {
    return key.substring(key.indexOf(':') + 1);
  }

  isKeySupported(namespace, key) {
    const keyNamespace = this.getKeyNamespace(key);
    if (keyNamespace && keyNamespace !== namespace) {
      return key in SVG_ATTRIBUTES;
    }
    return true;
  }

  buildNode(namespace, key, node, level = 0) {
    if (!this.isKeySupported(namespace, key)) {
      return '';
    }

    const name = this.getKeyName(key);
    const attributes = this.buildAttributes(namespace, node);
    const children = this.buildChildren(namespace, node, level + 1);

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

  buildAttributes(namespace, node) {
    const attributesObject = node.$ || {};

    return Object.keys(attributesObject).map((key) => {
      const value = attributesObject[key];
      if (!this.isKeySupported(namespace, key)) {
        return '';
      }
      const keyName = this.getKeyName(key);
      return `${SVG_ATTRIBUTES[key] || keyName}="${value}"`;
    }).filter(Boolean).join(' ');
  }

  buildChildren(namespace, node, level) {
    const childrenTags = Object.keys(node).filter((key) => key !== '$');

    return childrenTags
      .map((key) => this.buildChild(namespace, key, node, level))
      .filter((child) => Boolean(child.trim()))
      .join(settings.endOfLine);
  }

  buildChild(namespace, key, node, level) {
    const tagValue = node[key];
    const tagName = this.getKeyName(key);

    if (!this.isKeySupported(namespace, key)) {
      return '';
    }

    if (Array.isArray(tagValue)) {
      const indent = generateIndent(level * settings.indent);

      return tagValue.map((element) => {
        if (typeof element === 'string') {
          const trimmed = element.trim();
          if (trimmed.length > 0) {
            return `${indent}<${tagName}>${trimmed}</${tagName}>`;
          }
          return `${indent}<${tagName} />`;
        }

        return `${indent}${this.buildNode(namespace, key, element, level)}`;
      }).join(settings.endOfLine);
    }

    if (typeof tagValue === 'object') {
      return this.buildNode(namespace, key, node, level + 1);
    }

    return '';
  }
}

module.exports = ConvertSvgToComponent;
