const generate = require('@babel/generator').default;
const { AbstractBuilder } = require('../model');
const { babelGeneratorOptions } = require('../options');
const { squeezeCode, indentCode } = require('../utils');
const { getClassMethod, getReturnStatement } = require('../node-utils');

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
    // if (this.propTypesNode) {
    //   code += '\n';
    //   code += indentCode(this.buildPropTypes(), 2);
    //   code += '\n';
    // }
    code += '\n';
    code += squeezeCode(this.buildBody(), 2);
    code += '\n';
    code += this.isSingleReturnStatement() ? ')' : '}';
    code += ';';
    code += this.buildSuffix();
    // code = code.replace(this.getOldPropTypes(), '');
    code = code.replace(/\n\n\n/g, '\n');
    return code;
  }

  buildBody() {
    if (this.isSingleReturnStatement()) {
      return this.buildJsx();
    }

    const bodyNodes = this.node.declarations[0].init.body.body;
    const firstNode = bodyNodes[0];
    const lastNonReturnNode = [ ...bodyNodes ].reverse().find((node) => node.type !== 'ReturnStatement');
    return this.code.substring(firstNode.start, lastNonReturnNode.end);
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
    const render = getClassMethod(this.node, 'render');
    return '';
  }

  buildPropTypes() {
    if (!this.propTypesNode) {
      return '';
    }

    const propTypes = generate(this.propTypesNode.expression.right, { ...babelGeneratorOptions, concise: false });
    return `static propTypes = ${propTypes.code};`
  }

  getOldPropTypes() {
    if (!this.propTypesNode) {
      return '';
    }

    return this.code.substring(this.propTypesNode.start, this.propTypesNode.end);
  }

  isSingleReturnStatement() {
    const render = getClassMethod(this.node, 'render');
    return render.body.body.length === 1;
  }

  setPropTypesNode(node) {
    this.propTypesNode = node;
  }
}

module.exports = ComponentBuilder;
