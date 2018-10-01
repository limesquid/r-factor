const parser = require('../../utils/parser');
const traverse = require('@babel/traverse').default;
const {
  isExportDefaultArrowComponentDeclaration,
  isArrowComponentDeclaration,
  isReactImport
} = require('../../utils/ast');
const { Refactoring } = require('../../model');
const settings = require('../../settings');
const ConvertFunctionToArrowComponent = require('../convert-function-to-arrow-component');
const MoveDefaultPropsAndPropTypesToClass = require('../move-default-props-and-prop-types-to-class');
const ComponentBuilder = require('./component-builder');
const ReactImportBuilder = require('./react-import-builder');

const convertFunctionToArrowComponent = new ConvertFunctionToArrowComponent();
const moveDefaultPropsAndPropTypesToClass = new MoveDefaultPropsAndPropTypesToClass();

class ConvertToClassComponent extends Refactoring {
  constructor() {
    super();
    this.transformations = [
      (code, ast) => this.refactorComponentNameCollision(code, ast),
      (code, ast) => {
        if (convertFunctionToArrowComponent.canApply(code)) {
          return convertFunctionToArrowComponent.refactor(code, ast);
        }
        return code;
      },
      (code, ast) => this.refactorComponent(code, ast),
      (code, ast) => this.refactorReactImport(code, ast),
      (code) => moveDefaultPropsAndPropTypesToClass.refactor(code)
    ];
  }

  canApply(code) {
    if (convertFunctionToArrowComponent.canApply(code)) {
      return true;
    }

    const ast = parser.parse(code);
    let hasReactImport = false;
    let isFunctionalComponent = false;

    traverse(ast, {
      ExportDefaultDeclaration({ node }) {
        if (isExportDefaultArrowComponentDeclaration(node)) {
          isFunctionalComponent = true;
        }
      },
      ImportDeclaration({ node }) {
        if (isReactImport(node)) {
          hasReactImport = true;
        }
      },
      VariableDeclaration({ node }) {
        if (isArrowComponentDeclaration(node)) {
          isFunctionalComponent = true;
        }
      }
    });

    return moveDefaultPropsAndPropTypesToClass.canApply(code)
      || hasReactImport
      || isFunctionalComponent;
  }

  refactorComponentNameCollision(code, ast) {
    traverse(ast, {
      Identifier(path) {
        const { node } = path;
        if (node.name === settings.componentSuperclass) {
          path.scope.rename(
            settings.componentSuperclass,
            settings.componentNameCollisionPattern.replace('${name}', 'Component')
          );
        }
      }
    });

    return parser.print(ast);
  }

  refactorComponent(code, ast) {
    const builder = new ComponentBuilder(code);

    traverse(ast, {
      ExportDefaultDeclaration({ node }) {
        if (isExportDefaultArrowComponentDeclaration(node)) {
          builder.setNode(node);
        }
      },
      VariableDeclaration({ node }) {
        if (isArrowComponentDeclaration(node)) {
          builder.setNode(node);
        }
      }
    });

    return builder.build();
  }

  refactorReactImport(code, ast) {
    const builder = new ReactImportBuilder(code);

    traverse(ast, {
      ImportDeclaration({ node }) {
        if (isReactImport(node)) {
          builder.setNode(node);
        }
      }
    });

    return builder.build();
  }
}

module.exports = ConvertToClassComponent;
