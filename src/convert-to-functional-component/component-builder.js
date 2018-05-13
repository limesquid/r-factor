const generate = require('@babel/generator').default;
const { AbstractBuilder } = require('../model');
const { babelGeneratorOptions } = require('../options');
const { squeezeCode, indentCode } = require('../utils');

class ComponentBuilder extends AbstractBuilder {
  constructor(code) {
    super(code);
    this.propTypesNode = null;
  }

  build() {
    if (!this.node) {
      return this.code;
    }

    let code = '';
    code += this.buildPrefix();
    code += this.buildDeclaration();
    if (this.propTypesNode) {
      code += '\n';
      code += indentCode(this.buildPropTypes(), 2);
      code += '\n';
    }
    code += this.buildRender();
    code += '\n';
    code += `}`;
    code += this.buildSuffix();
    code = code.replace(this.getOldPropTypes(), '');
    code = code.replace(/\n\n\n/g, '\n');
    return code;
  }

  buildBody() {
    if (this.isSingleReturnStatement()) {
      return '';
    }

    const bodyNodes = this.node.declarations[0].init.body.body;
    const firstNode = bodyNodes[0];
    const lastNonReturnNode = [ ...bodyNodes ].reverse().find((node) => node.type !== 'ReturnStatement');
    return this.code.substring(firstNode.start, lastNonReturnNode.end);
  }

  buildDeclaration() {
    return `class ${this.buildName()} extends Component {`;
  }

  buildJsx() {
    const functionBody = this.node.declarations[0].init.body;
    const jsxNode = this.isSingleReturnStatement()
      ? functionBody
      : [ ...functionBody.body ].reverse().find((node) => node.type === 'ReturnStatement').argument;
    return this.code.substring(jsxNode.start, jsxNode.end);
  }

  buildName() {
    return this.node.declarations[0].id.name;
  }

  buildProps() {
    const params = this.node.declarations[0].init.params;
    const propsNode = params[0];

    if (params.length === 0) {
      return '';
    }

    if (propsNode.type === 'ObjectPattern') {
      return `const ${generate(propsNode, babelGeneratorOptions).code} = this.props;`
    } else if (propsNode.type === 'Identifier') {
      return `const ${propsNode.name} = this.props;`
    }

    return '';
  }

  buildPropTypes() {
    if (!this.propTypesNode) {
      return '';
    }

    const propTypes = generate(this.propTypesNode.expression.right, { ...babelGeneratorOptions, concise: false });
    return `static propTypes = ${propTypes.code};`
  }

  buildRender() {
    const body = this.buildBody();
    const jsx = this.buildJsx();
    const props = this.buildProps();
    let code = '';
    code += '\n';
    code += indentCode(`render() {`, 2);
    code += '\n';
    code += indentCode(props, 4);
    code += props ? '\n' : '';
    code += indentCode(body, 4);
    code += body ? '\n\n' : '';
    code += ((props && !body) ? '\n' : '');
    code += indentCode(`return (`, 4);
    code += '\n';
    if (this.isSingleReturnStatement()) {
      code += squeezeCode(jsx, 6, 2);
    } else {
      code += squeezeCode(jsx, 6, 4);
    }
    code += '\n';
    code += indentCode(`);`, 4);
    code += '\n';
    code += indentCode(`}`, 2);
    return code;
  }

  getOldPropTypes() {
    if (!this.propTypesNode) {
      return '';
    }

    return this.code.substring(this.propTypesNode.start, this.propTypesNode.end);
  }

  isSingleReturnStatement() {
    return this.node.declarations[0].init.body.type === 'JSXElement';
  }

  setPropTypesNode(node) {
    this.propTypesNode = node;
  }
}

module.exports = ComponentBuilder;
