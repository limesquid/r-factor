const { Builder } = require('../../model');
const { cleanUpCode, squeezeCode } = require('../../utils');
const { getNodeIndent } = require('../../utils/ast');
const sortObjectAttributes = require('../sort-object-attributes');

class FunctionalComponentBuilder extends Builder {
  constructor(code, node) {
    super(code, node);
    this.props = null;
  }

  build() {
    const destructuringNode = this.getDestructuringNode();
    let code = '';

    if (destructuringNode) {
      code += this.code.substring(0, destructuringNode.start);
      if (destructuringNode.type === 'Identifier') {
        code += `{ ${this.getProps()}, ...${destructuringNode.name} }`;
      } else {
        const props = this.getProps(destructuringNode);
        code += squeezeCode(props, 0, getNodeIndent(this.node));
      }
      code += this.code.substring(destructuringNode.end);
    } else {
      const functionNode = this.getFunctionNode();
      const start = this.code.indexOf('(', functionNode.start);
      const end = this.code.indexOf(')', functionNode.start);
      code += this.code.substring(0, start + 1);
      code += `{ ${this.getProps()} }`;
      code += this.code.substring(end);
    }

    return cleanUpCode(code);
  }

  getDestructuringNode() {
    const componentDeclaration = this.node.declarations[0];
    const params = componentDeclaration.init.params;
    if (params.length === 0) {
      return null;
    }
    return params[0];
  }

  getFunctionNode() {
    const componentDeclaration = this.node.declarations[0];
    return componentDeclaration.init;
  }

  getProps(destructuringNode) {
    if (destructuringNode) {
      const extendedNode = {
        ...destructuringNode,
        properties: [
          ...destructuringNode.properties,
          { code: 'className', name: 'className' }
        ]
      };
      return sortObjectAttributes(this.code, extendedNode, 0);
    }

    return this.props.join(',');
  }

  setProps(props) {
    this.props = props;
  }
}

module.exports = FunctionalComponentBuilder;
