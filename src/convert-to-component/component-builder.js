const generate = require('@babel/generator').default;
const { AbstractBuilder } = require('../model');
const { babelGeneratorOptions } = require('../options');
const { cleanUpCode, indentCode, squeezeCode } = require('../utils');

class ComponentBuilder extends AbstractBuilder {
  build() {
    if (!this.node) {
      return this.code;
    }

    const indent = this.getIndent();
    let code = '';
    code += this.buildPrefix();
    code += this.buildDeclaration();
    code += this.buildRender();
    code += '\n';
    code += indentCode('}', indent);
    code += this.buildSuffix();
    code = cleanUpCode(code);
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
    const jsx = this.code.substring(jsxNode.start, jsxNode.end);
    if (this.isSingleReturnStatement()) {
      return squeezeCode(jsx, 6, 2);
    }
    return squeezeCode(jsx, 6, 4);
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
      return `const ${generate(propsNode, babelGeneratorOptions).code} = this.props;`;
    } else if (propsNode.type === 'Identifier') {
      return `const ${propsNode.name} = this.props;`;
    }

    return '';
  }

  buildRender() {
    const body = this.buildBody();
    const props = this.buildProps();
    let code = '';
    code += '\n';
    code += indentCode('render() {', 2);
    code += '\n';
    code += indentCode(props, 4);
    code += props ? '\n' : '';
    code += indentCode(body, 4);
    code += body ? '\n\n' : '';
    code += ((props && !body) ? '\n' : '');
    code += this.buildReturnStatement();
    code += '\n';
    code += indentCode('}', 2);
    return code;
  }

  buildReturnStatement() {
    let code = '';
    code += indentCode('return (', 4);
    code += '\n';
    code += this.buildJsx();
    code += '\n';
    code += indentCode(');', 4);
    return code;
  }

  isSingleReturnStatement() {
    return this.node.declarations[0].init.body.type === 'JSXElement';
  }
}

module.exports = ComponentBuilder;
