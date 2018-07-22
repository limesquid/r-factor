const { isIdentifier } = require('@babel/types');
const { Refactoring } = require('../../model');
const parser = require('../../utils/parser');
const ComponentExportDetails = require('../../utils/component-export-details');
const wrapComponent = require('../../transformations/wrap-component');
const unwrapComponent = require('../../transformations/unwrap-component');

class ToggleWithRouterHoc extends Refactoring {
  canApply() {
    return true;
  }

  refactor(code, ast = parser.parse(code)) {
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
