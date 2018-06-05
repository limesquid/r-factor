const babylon = require('@babel/parser');
const { babylonOptions } = require('../../options');
const { Builder } = require('../../model');
const { cleanUpCode } = require('../../utils');
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

  buildClassNames(classNameAttribute) {
    const { value } = classNameAttribute;
    if (value.type === 'StringLiteral') {
      return `classNames('${value.value}', className)`;
    }

    const { start, end } = value.expression;
    return `classNames(${this.code.substring(start, end)}, className)`;
  }

  getClassNameAttribute() {
    return this.node.openingElement.attributes.find(
      ({ name }) => name.name === 'className'
    );
  }

  setAst(ast) {
    this.ast = ast;
  }
}

module.exports = ComponentBuilder;
