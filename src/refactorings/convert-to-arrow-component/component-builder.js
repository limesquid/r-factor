const generate = require('@babel/generator').default;
const { Builder } = require('../../model');
const settings = require('../../settings');
const { babelGeneratorOptions } = require('../../options');
const { cleanUpCode, indentCode, squeezeCode } = require('../../utils');
const { getClassMethod, getReturnStatement, isPropsDeclaration } = require('../../utils/ast');

class ComponentBuilder extends Builder {
  build() {
    if (!this.node) {
      return this.code;
    }

    const indent = this.getIndent();
    const hasPropsDeclaration = this.hasPropsDeclaration();
    const isSingleReturnStatement = this.isSingleReturnStatement();
    let code = '';
    code += this.buildPrefix();
    code += this.buildDeclaration();
    code += settings.endOfLine;
    if (hasPropsDeclaration || isSingleReturnStatement) {
      code += indentCode(this.buildBody(), indent);
    } else {
      code += squeezeCode(this.buildBody(), settings.indent + indent, indent);
    }
    code += settings.endOfLine;
    code += indentCode(isSingleReturnStatement ? ')' : '}', indent);
    code += settings.semicolon;
    code += this.buildSuffix();
    if (hasPropsDeclaration) {
      code = code.replace(`${this.getOldPropsDeclaration()}${settings.doubleEndOfLine}`, '');
      code = code.replace(`${this.getOldPropsDeclaration()}${settings.endOfLine}`, '');
    }
    code = this.ensureProperExport(code);
    code = cleanUpCode(code);
    return code;
  }

  buildBody() {
    const indent = this.getIndent();

    if (this.isSingleReturnStatement()) {
      return squeezeCode(this.buildJsx(), settings.indent, -settings.doubleIndent - indent);
    }

    const returnStatementValue = this.getReturnStatementValue();
    const returnsJsx = [ 'JSXElement', 'JSXFragment' ].includes(returnStatementValue.type);
    const returnsMultiline = returnStatementValue.loc.start.line !== returnStatementValue.loc.end.line;
    let code = this.buildBodyNonReturnStatements();
    code += settings.doubleEndOfLine;
    code += indentCode(`return ${returnsJsx ? '(' : ''}`, settings.indent);
    if (returnsJsx) {
      code += settings.endOfLine;
    }
    if (returnsMultiline) {
      code += squeezeCode(this.buildJsx(), settings.doubleIndent, -settings.indent - indent);
    } else {
      code += this.buildJsx();
    }
    if (returnsJsx) {
      code += settings.endOfLine;
    }
    code += indentCode(
      `${returnsJsx ? ')' : ''}${settings.semicolon}`,
      returnsMultiline ? settings.indent : 0
    );
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
    code = indentCode(code, -settings.indent);
    return code;
  }

  buildJsx() {
    const jsxNode = this.getReturnStatementValue();
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

    return '';
  }

  ensureProperExport(code) {
    const declarationCode = `const ${this.buildName()}`;
    const defaultExportCode = `export default ${declarationCode}`;
    let newCode = code;
    if (newCode.includes(defaultExportCode)) {
      newCode = newCode.replace(defaultExportCode, declarationCode);
      newCode += settings.endOfLine;
      newCode += `export default ${this.buildName()}${settings.semicolon}`;
      newCode += settings.endOfLine;
    }
    return newCode;
  }

  getOldPropsDeclaration() {
    const propsNode = this.getPropsNode();
    return this.code.substring(propsNode.start, propsNode.end);
  }

  getPropsDeclaration() {
    const propsNode = this.getPropsNode();
    return propsNode.declarations.find(isPropsDeclaration);
  }

  getPropsNode() {
    const render = getClassMethod(this.node, 'render');
    const bodyNodes = render.body.body;
    return bodyNodes.find(
      ({ type, declarations }) => type === 'VariableDeclaration' && declarations.find(isPropsDeclaration)
    );
  }

  getReturnStatementValue() {
    const render = getClassMethod(this.node, 'render');
    const returnStatement = getReturnStatement(render);
    return returnStatement.argument;
  }

  hasPropsDeclaration() {
    return Boolean(this.getPropsNode() && this.getPropsDeclaration());
  }

  isSingleReturnStatement() {
    const render = getClassMethod(this.node, 'render');
    const body = render.body.body;
    return body.length === 1 || (body.length === 2 && this.hasPropsDeclaration());
  }
}

module.exports = ComponentBuilder;
