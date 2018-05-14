const generate = require('@babel/generator').default;
const { AbstractBuilder } = require('../model');
const { babelGeneratorOptions } = require('../options');
const { indentCode, removeDoubleNewlines, removeTrailingWhitespace, squeezeCode } = require('../utils');
const { getClassMethod, getReturnStatement, isPropsDeclaration } = require('../node-utils');

class ComponentBuilder extends AbstractBuilder {
  constructor(code) {
    super(code);
    this.defaultPropsNode = null;
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
    code += this.buildBody();
    code += '\n';
    code += this.isSingleReturnStatement() ? ')' : '}';
    code += ';';
    if (this.propTypesNode) {
      code += this.buildPropTypes();
    }
    if (this.defaultPropsNode) {
      code += this.buildDefaultProps();
    }
    code += this.buildSuffix();
    code = code.replace(this.getOldDefaultProps(), '');
    code = code.replace(this.getOldPropTypes(), '');
    code = removeDoubleNewlines(code);
    code = removeTrailingWhitespace(code);
    return code;
  }

  buildBody() {
    if (this.isSingleReturnStatement()) {
      if (this.hasPropsDeclaration()) {
        return squeezeCode(this.buildJsx(), 2, 6);
      }
      return indentCode(this.buildJsx(), 2);
    }

    const hasPropsDeclaration = this.hasPropsDeclaration();
    const render = getClassMethod(this.node, 'render');
    const bodyNodes = render.body.body;
    const firstNode = bodyNodes[0];
    const lastNonReturnNode = [ ...bodyNodes ].reverse().find((node) => node.type !== 'ReturnStatement');
    let code = this.code.substring(firstNode.start, lastNonReturnNode.end);
    code = indentCode(code, -2);
    if (hasPropsDeclaration) {
      const propsNode = this.getPropsNode();
      const oldDeclaration = this.code.substring(propsNode.start, propsNode.end);
      code = code.replace(`${oldDeclaration}\n`, '');
    }
    code += '\n\n';
    code += indentCode('return (', 2);
    code += '\n';
    code += squeezeCode(this.buildJsx(), 4, 6);
    code += '\n';
    code += indentCode(');', 2);
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

  buildDefaultProps() {
    if (!this.defaultPropsNode) {
      return '';
    }

    const defaultProps = generate(this.defaultPropsNode.value, { ...babelGeneratorOptions, concise: false });
    return `\n\n${this.buildName()}.defaultProps = ${defaultProps.code};\n\n`;
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
    return `\n\n${this.buildName()}.propTypes = ${propTypes.code};\n\n`;
  }

  getOldDefaultProps() {
    if (!this.defaultPropsNode) {
      return '';
    }

    return this.code.substring(this.defaultPropsNode.start, this.defaultPropsNode.end);
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

  setDefaultPropsNode(node) {
    this.defaultPropsNode = node;
  }

  setPropTypesNode(node) {
    this.propTypesNode = node;
  }
}

module.exports = ComponentBuilder;

/*
TODO:
  - this.props => props
*/
