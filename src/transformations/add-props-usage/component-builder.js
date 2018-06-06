const { Builder } = require('../../model');
const { cleanUpCode, generateIndent, squeezeCode } = require('../../utils');
const { getNodeIndent } = require('../../utils/ast');
const sortObjectAttributes = require('../sort-object-attributes');

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
        const props = this.getProps(destructuringNode);
        code += squeezeCode(props, 0, getNodeIndent(renderDefinition) + 2);
      }
      code += this.code.substring(destructuringNode.end);
    } else {
      const renderBody = renderDefinition.body.body;
      const start = renderBody[0].start - 1;
      const end = renderBody[0].start;
      code += this.code.substring(0, start + 1);
      code += `const { ${this.getProps()} } = this.props;\n\n`;
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

module.exports = ComponentBuilder;
