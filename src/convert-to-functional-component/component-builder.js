const generate = require('@babel/generator').default;
const { AbstractBuilder } = require('../model');
const { babelGeneratorOptions } = require('../options');
const { squeezeCode, indentCode } = require('../utils');
const { getClassMethod, getReturnStatement, isPropsDeclaration } = require('../node-utils');

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
    code += '\n';
    code += squeezeCode(this.buildBody(), 2);
    code += '\n';
    code += this.isSingleReturnStatement() ? ')' : '}';
    code += ';';
    if (this.propTypesNode) {
      code += '\n\n';
      code += this.buildPropTypes();
      code += '\n\n';
    }
    code += this.buildSuffix();
    code = code.replace(this.getOldPropTypes(), '');
    code = code.replace(/\n\n\n/g, '\n');

    return code;
  }

  buildBody() {
    if (this.isSingleReturnStatement()) {
      return indentCode(this.buildJsx(), -4);
    }

    const hasPropsDeclaration = this.hasPropsDeclaration();

    const render = getClassMethod(this.node, 'render');
    const bodyNodes = render.body.body;
    const firstNode = bodyNodes[0];
    const lastNonReturnNode = [ ...bodyNodes ].reverse().find((node) => node.type !== 'ReturnStatement');
    let code = this.code.substring(firstNode.start, lastNonReturnNode.end);
    code = indentCode(code, -6);
    if (hasPropsDeclaration) {
      const propsNode = this.getPropsNode();
      const oldDeclaration = this.code.substring(propsNode.start, propsNode.end);
      console.log(oldDeclaration);
      code = code.replace(oldDeclaration, '');
    }
    return code;
  }

  buildDeclaration() {
    const openParen = this.isSingleReturnStatement() ? '(' : '{';
    return `const ${this.buildName()} = (${this.buildProps()}) => ${openParen}`;
  }

  buildJsx() {
    const render = getClassMethod(this.node, 'render');
    const returnStatement = getReturnStatement(render);
    const jsxNode = returnStatement.argument;
    return this.code.substring(jsxNode.start, jsxNode.end);
  }

  buildName() {
    return this.node.id.name;
  }

  buildProps() {
    if (this.hasPropsDeclaration()) {
      const declaration = this.getPropsDeclaration();
      return generate(declaration.id, babelGeneratorOptions).code;
    }

    if (this.hasThisPropsUsages()) {
      return 'props';
    }

    return '';
  }

  buildPropTypes() {
    if (!this.propTypesNode) {
      return '';
    }

    const propTypes = generate(this.propTypesNode.value, { ...babelGeneratorOptions, concise: false });
    return `${this.buildName()}.propTypes = ${propTypes.code};`
  }

  getOldPropTypes() {
    if (!this.propTypesNode) {
      return '';
    }

    return this.code.substring(this.propTypesNode.start, this.propTypesNode.end);
  }

  getPropsNode() {
    const render = getClassMethod(this.node, 'render');
    const bodyNodes = render.body.body;
    return bodyNodes.find(
      ({ type, declarations }) => type === 'VariableDeclaration' && declarations.find(isPropsDeclaration)
    );
  }

  getPropsDeclaration() {
    const propsNode = this.getPropsNode();
    return propsNode.declarations.find(isPropsDeclaration);
  }

  hasThisPropsUsages() {
    // TODO
    return false;
  }

  hasPropsDeclaration() {
    return Boolean(this.getPropsNode() && this.getPropsDeclaration());
  }

  isSingleReturnStatement() {
    const render = getClassMethod(this.node, 'render');
    const body = render.body.body;
    return body.length === 1 || (body.length === 2 && this.hasPropsDeclaration());
  }

  setPropTypesNode(node) {
    this.propTypesNode = node;
  }
}

module.exports = ComponentBuilder;

/*TODO:
- this.props => props
*/
