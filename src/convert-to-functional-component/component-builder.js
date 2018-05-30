const generate = require('@babel/generator').default;
const { AbstractBuilder } = require('../model');
const { babelGeneratorOptions } = require('../options');
const { cleanUpCode, indentCode, squeezeCode } = require('../utils');
const { getClassMethod, getReturnStatement, isPropsDeclaration } = require('../node-utils');

class ComponentBuilder extends AbstractBuilder {
  build() {
    if (!this.node) {
      return this.code;
    }

    const indent = this.getIndent();
    let code = '';
    code += this.buildPrefix();
    code += this.buildDeclaration();
    code += '\n';
    code += indentCode(this.buildBody(), indent);
    code += '\n';
    code += indentCode(this.isSingleReturnStatement() ? ')' : '}', indent);
    code += ';';
    code += this.buildSuffix();
    if (this.hasPropsDeclaration()) {
      code = code.replace(`${this.getOldPropsDeclaration()}\n`, '');
    }
    code = this.ensureProperExport(code);
    code = cleanUpCode(code);
    return code;
  }

  buildBody() {
    if (this.isSingleReturnStatement()) {
      if (this.hasPropsDeclaration()) {
        return squeezeCode(this.buildJsx(), 2, 6);
      }
      return indentCode(this.buildJsx(), 2);
    }

    let code = this.buildBodyNonReturnStatements();
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
    const name = this.buildName();
    const value = `(${this.buildProps()}) => ${openParen}`;
    if (name) {
      return `const ${name} = ${value}`;
    }
    return value;
  }

  buildBodyNonReturnStatements() {
    const render = getClassMethod(this.node, 'render');
    const bodyNodes = render.body.body;
    const firstNode = bodyNodes[0];
    const lastNonReturnNode = [ ...bodyNodes ].reverse().find((node) => node.type !== 'ReturnStatement');
    let code = this.code.substring(firstNode.start, lastNonReturnNode.end);
    code = indentCode(code, -2);
    return code;
  }

  buildJsx() {
    const render = getClassMethod(this.node, 'render');
    const returnStatement = getReturnStatement(render);
    const jsxNode = returnStatement.argument;
    return this.code.substring(jsxNode.start, jsxNode.end);
  }

  buildName() {
    const { id } = this.node;
    return id && id.name;
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

  ensureProperExport(code) {
    const declarationCode = `const ${this.buildName()}`;
    const defaultExportCode = `export default ${declarationCode}`;
    let newCode = code;
    if (newCode.includes(defaultExportCode)) {
      newCode = newCode.replace(defaultExportCode, declarationCode);
      newCode += '\n';
      newCode += `export default ${this.buildName()};`;
      newCode += '\n';
    }
    return newCode;
  }

  getPropsNode() {
    const render = getClassMethod(this.node, 'render');
    const bodyNodes = render.body.body;
    return bodyNodes.find(
      ({ type, declarations }) => type === 'VariableDeclaration' && declarations.find(isPropsDeclaration)
    );
  }

  getOldPropsDeclaration() {
    const propsNode = this.getPropsNode();
    return this.code.substring(propsNode.start, propsNode.end);
  }

  getPropsDeclaration() {
    const propsNode = this.getPropsNode();
    return propsNode.declarations.find(isPropsDeclaration);
  }

  hasPropsDeclaration() {
    return Boolean(this.getPropsNode() && this.getPropsDeclaration());
  }

  hasThisPropsUsages() {
    // TODO
    return false;
  }

  isSingleReturnStatement() {
    const render = getClassMethod(this.node, 'render');
    const body = render.body.body;
    return body.length === 1 || (body.length === 2 && this.hasPropsDeclaration());
  }
}

module.exports = ComponentBuilder;

/*
TODO:
  - this.props => props
*/
