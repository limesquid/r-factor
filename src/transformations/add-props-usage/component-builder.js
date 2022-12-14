const { Builder } = require('../../model');
const settings = require('../../settings');
const { cleanUpCode, generateIndent } = require('../../utils');
const { getNodeIndent } = require('../../utils/ast');
const printObjectAttributes = require('../print-object-attributes');

class ComponentBuilder extends Builder {
  constructor(code, node) {
    super(code, node);
    this.props = null;
  }

  build() {
    const destructuringNode = this.getDestructuringNode();
    const renderDefinition = this.getFunctionNode();
    let code = '';

    if (destructuringNode) {
      code += this.code.substring(0, destructuringNode.start);
      if (destructuringNode.type === 'Identifier') {
        code += `{ ${this.getProps()}, ...${destructuringNode.name} }`;
      } else {
        code += this.getProps(destructuringNode);
      }
      code += this.code.substring(destructuringNode.end);
    } else {
      const renderBody = renderDefinition.body.body;
      const start = renderBody[0].start - 1;
      const end = renderBody[0].start;
      const left = `const { ${this.getProps()} }`;
      const right = `this.props${settings.semicolon}${settings.doubleEndOfLine}`;
      code += this.code.substring(0, start + 1);
      code += `${left} = ${right}`;
      code += generateIndent(getNodeIndent(renderBody[0]));
      code += this.code.substring(end);
    }

    return cleanUpCode(code);
  }

  getDestructuringNode() {
    const renderDefinition = this.getFunctionNode();
    const renderBody = renderDefinition.body.body;
    const declaration = renderBody.find(
      ({ declarations, type }) => type === 'VariableDeclaration'
        && declarations.find(
          ({ init, type: declarationType }) => declarationType === 'VariableDeclarator'
            && this.code.substring(init.start, init.end) === 'this.props'
        )
    );
    if (declaration) {
      const declarator = declaration.declarations.find(
        ({ init, type }) => type === 'VariableDeclarator'
          && this.code.substring(init.start, init.end) === 'this.props'
      );
      return declarator && declarator.id;
    }
    return declaration;
  }

  getFunctionNode() {
    const classBody = this.node.body.body;
    return classBody.find(
      ({ key, type }) => type === 'ClassMethod' && key.name === 'render'
    );
  }

  getProps(destructuringNode) {
    if (!destructuringNode) {
      return this.props.join(', ');
    }

    const restElement = destructuringNode.properties.find(({ type }) => type === 'RestElement');
    const currentProperties = destructuringNode.properties.filter(({ type }) => type !== 'RestElement');

    const extendedNode = {
      ...destructuringNode,
      properties: [
        ...currentProperties,
        ...this.props
          .filter((prop) => !currentProperties.find(
            (property) => property.value && property.value.name === prop
          ))
          .map((prop) => ({ code: prop, name: prop }))
      ]
    };

    if (restElement) {
      extendedNode.properties.push(restElement);
    }

    const currentPropertiesString = printObjectAttributes(this.code, destructuringNode, {
      indentSize: destructuringNode.loc.indent,
      sort: false
    });
    const sortedPropertiesString = printObjectAttributes(this.code, destructuringNode, {
      indentSize: destructuringNode.loc.indent,
      sort: true
    });
    const areCurrentPropertiesSorted = currentPropertiesString === sortedPropertiesString;

    return printObjectAttributes(this.code, extendedNode, {
      indentSize: extendedNode.loc.indent,
      sort: areCurrentPropertiesSorted
    });
  }

  setProps(props) {
    this.props = props;
  }
}

module.exports = ComponentBuilder;
