const Refactoring = require('./refactoring');
const ReduxDetailsBuilder = require('../builders/redux-connect-builder/redux-details-builder');
const settings = require('../settings');
const parser = require('../utils/parser');
const { getIndent, generateIndent } = require('../utils');
const ConvertFunctionToArrowComponent = require('../refactorings/convert-function-to-arrow-component');
const ConvertToFunctionComponent = require('../refactorings/convert-to-function-component');

const convertFunctionToArrowComponent = new ConvertFunctionToArrowComponent();
const convertToFunctionComponent = new ConvertToFunctionComponent();

class ConnectRefactoring extends Refactoring {
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
      const mapStateToPropsNode = details.mapStateToPropsDefinitionPath.node;
      const mapStateToPropsCode = parser.print(mapStateToPropsNode);
      const body = mapStateToPropsNode.declarations[0].init.body;
      const properties = body.properties;
      if (properties.length === 0) {
        const indent = getIndent(mapStateToPropsCode);
        const newIndent = generateIndent(indent + settings.indent);
        const updatedMapStateToPropsCode = mapStateToPropsCode.replace(/^$/m, newIndent)
        return code.replace(mapStateToPropsCode, updatedMapStateToPropsCode);
      }
    }
    return code;
  }

  restoreMapDispatchToPropsWhitespace(code, ast) {
    const reduxDetailsBuilder = new ReduxDetailsBuilder(ast);
    const details = reduxDetailsBuilder.getDetails();
    if (details.hasMapDispatchToPropsDefinition) {
      const mapDispatchToPropsNode = details.mapDispatchToPropsDefinitionPath.node;
      const mapDispatchToPropsCode = parser.print(mapDispatchToPropsNode);
      const body = mapDispatchToPropsNode.declarations[0].init.body || mapDispatchToPropsNode.declarations[0].init;
      const properties = body.properties;
      if (properties.length === 0) {
        const indent = getIndent(mapDispatchToPropsCode);
        const newIndent = generateIndent(indent + settings.indent);
        const updatedMapDispatchToPropsCode = mapDispatchToPropsCode.replace(/^$/m, newIndent)
        return code.replace(mapDispatchToPropsCode, updatedMapDispatchToPropsCode);
      }
    }
    return code;
  }
}

module.exports = ConnectRefactoring;
