const { isIdentifier } = require('@babel/types');
const FunctionComponentCompatibleRefactoring = require('../../model/function-component-compatible-refactoring');
const ComponentExportDetails = require('../../utils/component-export-details');
const wrapComponent = require('../../transformations/wrap-component');
const unwrapComponent = require('../../transformations/unwrap-component');

class ToggleWithRouterHoc extends FunctionComponentCompatibleRefactoring {
  constructor() {
    super();
    this.transformations = [
      this.toggleWithRouterHoc.bind(this)
    ];
  }

  canApply() {
    return true;
  }

  toggleWithRouterHoc(code, ast) {
    const details = new ComponentExportDetails(ast).getDetails();
    const { outermostHocPath } = details;
    let isWrapped = false;

    if (outermostHocPath) {
      outermostHocPath.parentPath.traverse({
        CallExpression(path) {
          const { node } = path;
          if (isIdentifier(node.callee) && node.callee.name === 'withRouter') {
            isWrapped = true;
            path.stop();
          }
        }
      });
    }

    return isWrapped
      ? this.unwrap(code, ast)
      : this.wrap(code, ast);
  }

  unwrap(code, ast) {
    return unwrapComponent(code, ast, {
      name: 'withRouter',
      import: {
        module: 'react-router',
        removeImportIfEmpty: true,
        subImports: [ 'withRouter' ]
      }
    });
  }

  wrap(code, ast) {
    return wrapComponent(code, ast, {
      name: 'withRouter',
      outermost: true,
      import: {
        module: 'react-router',
        subImports: [
          { name: 'withRouter' }
        ]
      }
    });
  }
}

module.exports = ToggleWithRouterHoc;
