const Refactoring = require('./refactoring');
const ReduxDetailsBuilder = require('../builders/redux-connect-builder/redux-details-builder');
const settings = require('../settings');
const { generateIndent, getNodeLines } = require('../utils');
const ConvertFunctionToArrowComponent = require('../refactorings/convert-function-to-arrow-component');
const ConvertToFunctionComponent = require('../refactorings/convert-to-function-component');

const convertFunctionToArrowComponent = new ConvertFunctionToArrowComponent();
const convertToFunctionComponent = new ConvertToFunctionComponent();

class FunctionComponentCompatibleRefactoring extends Refactoring {
  getTransformations(initialCode) {
    if (convertFunctionToArrowComponent.canApply(initialCode)) {
      return [
        (code, ast) => convertFunctionToArrowComponent.refactor(code, ast),
        ...this.transformations,
        (code, ast) => convertToFunctionComponent.refactor(code, ast),
        (code, ast) => this.restoreMapStateToPropsWhitespace(code, ast),
        (code, ast) => this.restoreMapDispatchToPropsWhitespace(code, ast)
      ];
    }
    return this.transformations;
  }

  restoreMapStateToPropsWhitespace(code, ast) {
    const reduxDetailsBuilder = new ReduxDetailsBuilder(ast);
    const details = reduxDetailsBuilder.getDetails();
    if (details.hasMapStateToPropsDefinition) {
      return this.restoreWhitespaceInNode(code, details.mapStateToPropsDefinitionPath.node);
    }
    return code;
  }

  restoreMapDispatchToPropsWhitespace(code, ast) {
    const reduxDetailsBuilder = new ReduxDetailsBuilder(ast);
    const details = reduxDetailsBuilder.getDetails();
    if (details.hasMapDispatchToPropsDefinition) {
      return this.restoreWhitespaceInNode(code, details.mapDispatchToPropsDefinitionPath.node);
    }
    return code;
  }

  restoreWhitespaceInNode(code, node) {
    const nodeCode = getNodeLines(code, node);
    const body = node.declarations[0].init.body || node.declarations[0].init;
    const properties = body.properties;
    if (properties.length === 0) {
      const indent = node.loc.indent;
      const newIndent = generateIndent(indent + settings.indent);
      const updatedNodeCode = nodeCode.replace(/^$/m, newIndent);
      return code.replace(nodeCode, updatedNodeCode);
    }
    return code;
  }
}

module.exports = FunctionComponentCompatibleRefactoring;
