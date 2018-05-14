const babylon = require('babylon');
const traverse = require('@babel/traverse').default;
const { isClass, isMemberOfDeclaration } = require('../node-utils');
const { babylonOptions } = require('../options');
const { AbstractRefactoring } = require('../model');
const ClassBuilder = require('./class-builder');

class MoveStaticFieldToClass extends AbstractRefactoring {
  constructor(staticFieldName, isClassDeclaration = isClass) {
    super();
    this.staticFieldName = staticFieldName;
    this.isClassDeclaration = isClassDeclaration;
    this.transformations = [
      (code, ast) => this.refactorClass(code, ast)
    ];
  }

  canApply(code) {
    const { isClassDeclaration, staticFieldName } = this;
    const ast = babylon.parse(code, babylonOptions);
    let hasStaticField = false;
    let isComponent = false;
    let className = null;

    traverse(ast, {
      ClassDeclaration({ node }) {
        if (isClassDeclaration(node)) {
          isComponent = true;
          className = node.id.name;
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
    const { isClassDeclaration, staticFieldName } = this;
    const builder = new ClassBuilder(code, staticFieldName);
    let className = null;

    traverse(ast, {
      ClassDeclaration({ node }) {
        if (isClassDeclaration(node)) {
          builder.setNode(node);
          className = node.id.name;
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
