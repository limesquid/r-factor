const babylon = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const { isClass, isStaticPropertyDeclaration } = require('../node-utils');
const { babylonOptions } = require('../options');
const { AbstractRefactoring } = require('../model');
const ClassBuilder = require('./class-builder');

class MoveStaticFieldOutOfClass extends AbstractRefactoring {
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

    traverse(ast, {
      ClassDeclaration({ node }) {
        if (isClassDeclaration(node)) {
          isComponent = true;
        }
      },
      ClassProperty({ node }) {
        if (isStaticPropertyDeclaration(node, staticFieldName)) {
          hasStaticField = true;
        }
      }
    });

    return hasStaticField && isComponent;
  }

  refactorClass(code, ast) {
    const { isClassDeclaration, staticFieldName } = this;
    const builder = new ClassBuilder(code, staticFieldName);

    traverse(ast, {
      ClassDeclaration({ node }) {
        if (isClassDeclaration(node)) {
          builder.setNode(node);
        }
      },
      ClassProperty({ node }) {
        if (isStaticPropertyDeclaration(node, staticFieldName)) {
          builder.setStaticFieldNode(node);
        }
      }
    });

    return builder.build();
  }
}

module.exports = MoveStaticFieldOutOfClass;
