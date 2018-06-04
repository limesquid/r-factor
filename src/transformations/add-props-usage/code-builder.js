const { Builder } = require('../../model');
const { cleanUpCode, generateIndent } = require('../../utils');
const { getNodeIndent } = require('../../utils/ast');
const { COMPONENT_TYPE } = require('../../constants');

class ClassBuilder extends Builder {
  constructor(code, node) {
    super(code, node);
    this.componentNode = null;
    this.componentType = null;
    this.props = null;
  }

  build() {
    const isFunctionalComponent = this.componentType === COMPONENT_TYPE.Functional;
    const destructuringNode = this.getDestructuringNode();

    let code = '';
    if (isFunctionalComponent) {
      if (destructuringNode) {
        code += this.code.substring(0, destructuringNode.start);
        code += `{ ${this.props.join(',')} }`;
        code += this.code.substring(destructuringNode.end);
      } else {
        const functionNode = this.getFunctionNode();
        const start = this.code.indexOf('(', functionNode.start);
        const end = this.code.indexOf(')', functionNode.start);
        code += this.code.substring(0, start + 1);
        code += `{ ${this.props.join(',')} }`;
        code += this.code.substring(end);
      }
    } else {
      if (destructuringNode) {
        code += this.code.substring(0, destructuringNode.start);
        code += `const { ${this.props.join(',')} } = this.props;`;
        code += this.code.substring(destructuringNode.end);
      } else {
        const renderDefinition = this.getFunctionNode();
        const renderBody = renderDefinition.body.body;
        const start = renderBody[0].start - 1;
        const end = renderBody[0].start;
        code += this.code.substring(0, start + 1);
        code += `const { ${this.props.join(',')} } = this.props;\n\n`;
        code += generateIndent(getNodeIndent(renderBody[0]));
        code += this.code.substring(end);
      }
    }

    code = cleanUpCode(code);
    return code;
  }

  getDestructuringNode() {
    if (this.isFunctionalComponent()) {
      const componentDeclaration = this.componentNode.declarations[0];
      const params = componentDeclaration.init.params;
      if (params.length === 0) {
        return null;
      }
      return params[0];
    }

    const renderDefinition = this.getFunctionNode();
    const renderBody = renderDefinition.body.body;
    return renderBody.find(
      ({ declarations, type }) => type === 'VariableDeclaration'
        && declarations.find(
          ({ id, init, type }) => type === 'VariableDeclarator'
            && id.type === 'ObjectPattern'
            && this.code.substring(init.start, init.end) === 'this.props'
        )
    );
  }

  getFunctionNode() {
    if (this.isFunctionalComponent()) {
      const componentDeclaration = this.componentNode.declarations[0];
      return componentDeclaration.init;
    }

    const classBody = this.componentNode.body.body;
    return classBody.find(
      ({ key, type }) => type === 'ClassMethod' && key.name === 'render'
    );
  }

  isFunctionalComponent() {
    return this.componentType === COMPONENT_TYPE.Functional;
  }

  setComponentNode(node) {
    this.componentNode = node;
  }

  setComponentType(type) {
    this.componentType = type;
  }

  setProps(props) {
    this.props = props;
  }
}

module.exports = ClassBuilder;
