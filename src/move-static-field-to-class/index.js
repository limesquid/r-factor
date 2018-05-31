const babylon = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const { isMemberOfDeclaration } = require('../utils/ast');
const { babylonOptions } = require('../options');
const { Refactoring } = require('../model');
const ClassBuilder = require('./class-builder');

class MoveStaticFieldToClass extends Refactoring {
  constructor(staticFieldName, isDeclaration) {
    super();
    this.staticFieldName = staticFieldName;
    this.isDeclaration = isDeclaration;
    this.transformations = [
      (code, ast) => this.refactorClass(code, ast)
    ];
  }

  canApply(code) {
    const { isDeclaration, staticFieldName } = this;
    const ast = babylon.parse(code, babylonOptions);
    let hasStaticField = false;
    let isComponent = false;
    let className = null;

    traverse(ast, {
      ClassDeclaration({ node }) {
        if (isDeclaration(node)) {
          isComponent = true;
          className = node.id && node.id.name;
        }
      },
      ExpressionStatement({ node }) {
        if (isMemberOfDeclaration(node, className, staticFieldName)) {
          hasStaticField = true;
        }
      }
    });

    return hasStaticField && isComponent;
  }

  refactorClass(code, ast) {
    const { isDeclaration, staticFieldName } = this;
    const builder = new ClassBuilder(code, staticFieldName);
    let className = null;

    traverse(ast, {
      ClassDeclaration({ node }) {
        if (isDeclaration(node)) {
          builder.setNode(node);
          className = node.id && node.id.name;
        }
      },
      ExpressionStatement({ node }) {
        if (isMemberOfDeclaration(node, className, staticFieldName)) {
          builder.setStaticFieldNode(node);
        }
      }
    });

    return builder.build();
  }
}

module.exports = MoveStaticFieldToClass;
