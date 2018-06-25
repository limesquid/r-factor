const generate = require('@babel/generator').default;
const { Builder } = require('../../model');
const settings = require('../../settings');
const { babelGeneratorOptions } = require('../../options');
const { isExportDefaultArrowComponentDeclaration } = require('../../utils/ast');
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
    code += settings.endOfLine;
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
    let declaration = `class extends ${settings.componentSuperclass} {`;
    if (name) {
      declaration = `class ${name} extends ${settings.componentSuperclass} {`;
    }
    if (isExportDefaultArrowComponentDeclaration(this.node)) {
      return `export default ${declaration}`;
    }
    return declaration;
  }

  buildJsx() {
    const indent = this.getIndent();
    const functionBody = this.getDeclarationInit().body;
    const jsxNode = this.isSingleReturnStatement()
      ? functionBody
      : [ ...functionBody.body ].reverse().find((node) => node.type === 'ReturnStatement').argument;
    const jsx = this.code.substring(jsxNode.start, jsxNode.end);
    const squeeze = this.isSingleReturnStatement() ? settings.doubleIndent : settings.indent;
    return squeezeCode(jsx, 6, squeeze - indent);
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
        const left = `const ${generate(propsNode, babelGeneratorOptions).code}`;
        const right = `this.props${settings.semicolon}`;
        return `${left} = ${right}`;
      }
      return `const ${propsNode.name} = this.props${settings.semicolon}`;
    }

    return '';
  }

  buildRender() {
    const indent = this.getIndent();
    const body = this.buildBody();
    const props = this.buildProps();
    let code = '';
    code += settings.endOfLine;
    code += indentCode('render() {', indent + settings.indent);
    code += settings.endOfLine;
    code += indentCode(props, indent + settings.doubleIndent);
    code += props ? settings.endOfLine : '';
    if (body) {
      code += squeezeCode(
        body,
        indent + settings.doubleIndent,
        indent + settings.indent
      );
    }
    code += body ? settings.doubleEndOfLine : '';
    code += ((props && !body) ? settings.endOfLine : '');
    code += this.buildReturnStatement();
    code += settings.endOfLine;
    code += indentCode('}', indent + settings.indent);
    return code;
  }

  buildReturnStatement() {
    const indent = this.getIndent();
    let code = '';
    code += indentCode('return (', indent + settings.doubleIndent);
    code += settings.endOfLine;
    code += indentCode(this.buildJsx(), indent);
    code += settings.endOfLine;
    code += indentCode(`)${settings.semicolon}`, indent + settings.doubleIndent);
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
    return [ 'JSXElement', 'JSXFragment' ].includes(this.getDeclarationInit().body.type);
  }
}

module.exports = ComponentBuilder;
