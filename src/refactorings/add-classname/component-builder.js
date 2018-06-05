const babylon = require('@babel/parser');
const { babylonOptions } = require('../../options');
const { Builder } = require('../../model');
const { cleanUpCode, indentCode, squeezeCode } = require('../../utils');
const { getNodeIndent } = require('../../utils/ast');
const { addImportDeclaration, addRootJsxProps } = require('../../transformations');

class ComponentBuilder extends Builder {
  constructor(code) {
    super(code);
    this.ast = null;
  }

  build() {
    if (!this.node) {
      return this.code;
    }

    const classNameAttribute = this.getClassNameAttribute();

    if (!classNameAttribute) {
      return addRootJsxProps(this.code, this.ast, {
        className: 'className'
      });
    }

    const withJsxPropCode = addRootJsxProps(this.code, this.ast, {
      className: this.buildClassNames(classNameAttribute)
    });

    const ast = babylon.parse(withJsxPropCode, babylonOptions);
    return addImportDeclaration(withJsxPropCode, ast, {
      module: 'classnames',
      identifier: 'classNames'
    });
  }

  buildClassNames(node) {
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

    const { start, end } = value.expression.start;
    const existingExpression = this.code.substring(
      value.expression.start,
      value.expression.end
    );
    return `classNames(${existingExpression}, className)`;
  }

  getClassNameAttribute() {
    return this.node.openingElement.attributes.find(
      ({ name }) => name.name === 'className'
    );
  }

  isClassNamesUsage(jsxValue) {
    return jsxValue.expression.type === 'CallExpression'
      && jsxValue.expression.callee.name === 'classNames';
  }

  getClassNamesArguments(jsxValue) {
    const args = jsxValue.expression.arguments;
    const firstArgument = args[0];
    if (!firstArgument) {
      return 'className';
    }
    const lastArgument = args[args.length - 1];
    return `${this.code.substring(firstArgument.start, lastArgument.end)}, className`;
  }

  setAst(ast) {
    this.ast = ast;
  }
}

module.exports = ComponentBuilder;
