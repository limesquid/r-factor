const generate = require('@babel/generator').default;
const { babelGeneratorOptions } = require('../options');

const generateIndent = (length) => Array.from({ length }).map(() => ' ').join('');
const indentLines = (lines, size) => lines.map((line) => `${generateIndent(size)}${line}`);
const indentCode = (code, size) => code && indentLines(code.split('\n'), size).join('\n');

class AbstractBuilder {
  constructor(code) {
    this.code = code;
    this.node = null;
  }

  build() {
    return this.code;
  }

  buildPrefix() {
    return this.code.substring(0, this.node.start);
  }

  buildSuffix() {
    return this.code.substring(this.node.end);
  }

  setNode(node) {
    this.node = node;
  }
}

class Builder extends AbstractBuilder {
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
      : functionBody.body[functionBody.body.length - 1].argument;
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
    code += `      ${jsx.split('\n')[0]}${jsx.split('\n').slice(1).map((x) => `\n${this.isSingleReturnStatement() ? '  ' : ''}  ${x}`).join('')}\n`
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

module.exports = Builder;
