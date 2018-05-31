const generate = require('@babel/generator').default;
const { Builder } = require('../../model');
const { babelGeneratorOptions } = require('../../options');
const { isExportDefaultFunctionalComponentDeclaration } = require('../../utils/ast');
const { cleanUpCode, indentCode, squeezeCode } = require('../../utils');

class ComponentBuilder extends Builder {
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

    const bodyNodes = this.getDeclarationInit().body.body;
    const firstNode = bodyNodes[0];
    const lastNonReturnNode = [ ...bodyNodes ].reverse().find((node) => node.type !== 'ReturnStatement');
    return this.code.substring(firstNode.start, lastNonReturnNode.end);
  }

  buildDeclaration() {
    const name = this.buildName();
    let declaration = 'class extends Component {';
    if (name) {
      declaration = `class ${name} extends Component {`;
    }
    if (isExportDefaultFunctionalComponentDeclaration(this.node)) {
      return `export default ${declaration}`;
    }
    return declaration;
  }

  buildJsx() {
    const functionBody = this.getDeclarationInit().body;
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
    if (this.getDeclaration()) {
      return this.getDeclaration().id.name;
    }
    return '';
  }

  buildProps() {
    const params = this.getDeclarationInit().params;
    const propsNode = params[0];

    if (params.length > 0) {
      if (propsNode.type === 'ObjectPattern') {
        return `const ${generate(propsNode, babelGeneratorOptions).code} = this.props;`;
      }
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

  getDeclaration() {
    if (this.node.declarations) {
      return this.node.declarations[0];
    }
    return null;
  }

  getDeclarationInit() {
    const declaration = this.getDeclaration();
    if (declaration && declaration.init) {
      return declaration.init;
    }
    return this.node.declaration;
  }

  isSingleReturnStatement() {
    return this.getDeclarationInit().body.type === 'JSXElement';
  }
}

module.exports = ComponentBuilder;