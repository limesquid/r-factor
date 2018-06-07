const babylon = require('@babel/parser');
const { babylonOptions } = require('../../options');
const { Builder } = require('../../model');
const { indentCode, squeezeCode } = require('../../utils');
const { getNodeIndent } = require('../../utils/ast');
const { addImportDeclaration, addRootJsxProps } = require('../../transformations');

class ComponentBuilder extends Builder {
  constructor(code) {
    super(code);
    this.ast = null;
  }

  build() {
    const classNameAttribute = this.getClassNameAttribute();

    if (!classNameAttribute) {
      return addRootJsxProps(this.code, this.ast, {
        className: 'className'
      });
    }

    const value = this.buildClassNameValue(classNameAttribute);
    const withJsxPropCode = addRootJsxProps(this.code, this.ast, {
      className: value
    });

    if (value === 'className') {
      return withJsxPropCode;
    }

    const ast = babylon.parse(withJsxPropCode, babylonOptions);
    return addImportDeclaration(withJsxPropCode, ast, {
      module: 'classnames',
      identifier: 'classNames'
    });
  }

  buildClassNameValue(node) {
    const { loc, value } = node;
    const indent = getNodeIndent(node);

    if (value.type === 'StringLiteral') {
      return `classNames('${value.value}', className)`;
    }

    if (this.isClassNamesUsage(value)) {
      const args = this.getClassNamesArguments(value);
      const isMultiLine = loc.start.line !== loc.end.line;
      if (isMultiLine) {
        let code = 'classNames(\n';
        code += indentCode(
          args.split(',').map((arg) => arg.trim()).join(',\n'),
          2
        );
        code += '\n)';
        return squeezeCode(code, 0, indent);
      }
      return `classNames(${args})`;
    }

    const existingExpression = this.code.substring(
      value.expression.start,
      value.expression.end
    );

    if (existingExpression === 'className') {
      return existingExpression;
    }

    return `classNames(${existingExpression}, className)`;
  }

  getClassNameAttribute() {
    return this.node.openingElement.attributes.find(
      ({ name }) => name && name.name === 'className'
    );
  }

  getClassNamesArguments(jsxValue) {
    const args = jsxValue.expression.arguments;
    const firstArgument = args[0];
    if (!firstArgument) {
      return 'className';
    }
    const lastArgument = args[args.length - 1];
    const argsCode = this.code.substring(firstArgument.start, lastArgument.end);
    if (args.find(({ name }) => name === 'className')) {
      return `${argsCode}`;
    }
    return `${argsCode}, className`;
  }

  isClassNamesUsage(jsxValue) {
    return jsxValue.expression.type === 'CallExpression'
      && jsxValue.expression.callee.name === 'classNames';
  }

  setAst(ast) {
    this.ast = ast;
  }
}

module.exports = ComponentBuilder;
