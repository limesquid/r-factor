const traverse = require('@babel/traverse').default;
const { isComponentDeclaration } = require('../../utils/ast');
const settings = require('../../settings');
const { Refactoring } = require('../../model');
const ConvertToArrowComponent = require('../convert-to-arrow-component');
const ConvertToClassComponent = require('../convert-to-class-component');
const ConvertToFunctionComponent = require('../convert-to-function-component');

const convertToArrowComponent = new ConvertToArrowComponent();
const convertToClassComponent = new ConvertToClassComponent();
const convertToFunctionComponent = new ConvertToFunctionComponent();

class ToggleComponentType extends Refactoring {
  constructor() {
    super();
    this.transformations = [
      (code, ast) => this.refactorComponent(code, ast)
    ];
  }

  canApply(code) {
    return [
      convertToArrowComponent,
      convertToClassComponent,
      convertToFunctionComponent
    ].some((refactoring) => refactoring.canApply(code));
  }

  refactorComponent(code, ast) {
    let isClassComponent = false;

    traverse(ast, {
      ClassDeclaration({ node }) {
        if (isComponentDeclaration(node)) {
          isClassComponent = true;
        }
      }
    });

    if (isClassComponent) {
      if (settings.functionalComponentType === 'arrow') {
        return convertToArrowComponent.refactor(code, ast);
      }

      return convertToFunctionComponent.refactor(code, ast);
    }

    return convertToClassComponent.refactor(code, ast);
  }
}

module.exports = ToggleComponentType;
