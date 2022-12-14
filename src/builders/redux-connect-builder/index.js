const { identifier, isNullLiteral, nullLiteral } = require('@babel/types');
const parser = require('../../utils/parser');
const { removeBinding } = require('../../utils/bindings');
const { isUndefinedIdentifier } = require('../../utils/ast');
const { insertNodeAfterOrBefore } = require('../../utils');
const settings = require('../../settings');
const wrapComponent = require('../../transformations/wrap-component');
const unwrapComponent = require('../../transformations/unwrap-component');
const {
  checkIsConnected,
  createMapDispatchToPropsFunctionAst,
  createMapStateToPropsFunctionAst,
  createMergePropsFunctionAst
} = require('./utils');
const ReduxDetailsBuilder = require('./redux-details-builder');

class ReduxConnectBuilder {
  constructor(code, ast) {
    this.code = code;
    this.ast = ast || parser.parse(code);
    this.isConnected = checkIsConnected(this.ast);
  }

  updateDetails() {
    this.details = new ReduxDetailsBuilder(this.ast).getDetails();
  }

  wrapWithConnectHocIfNeeded() {
    if (this.isConnected) {
      return;
    }

    this.code = wrapComponent(this.code, this.ast, {
      name: 'connect',
      invoke: [],
      import: {
        module: 'react-redux',
        subImports: [
          { name: 'connect' }
        ]
      }
    });
    this.ast = parser.parse(this.code);
    this.isConnected = true;
  }

  cleanConnect() {
    const { connectCallExpressionPath } = this.details;
    const argumentsArray = connectCallExpressionPath.get('arguments');
    let index = argumentsArray.length - 1;
    while (
      index >= 0 &&
      (isNullLiteral(argumentsArray[index]) || isUndefinedIdentifier(argumentsArray[index]))
    ) {
      argumentsArray[index].remove();
      index--;
    }

    if (index === -1) {
      this.unwrapConnect();
    }
  }

  unwrapConnect() {
    this.code = unwrapComponent(this.code, this.ast, {
      name: 'connect',
      import: {
        module: 'react-redux',
        removeImportIfEmpty: true,
        subImports: [ 'connect' ]
      }
    });
    this.ast = parser.parse(this.code);
    this.isConnected = false;
  }

  connect() {
    this.connectState();
    this.connectDispatch();
    return this;
  }

  connectState() {
    this.wrapWithConnectHocIfNeeded();
    this.updateDetails();
    const {
      connectArguments,
      furthestConnectAncestorPath,
      hasMapStateToPropsDefinition,
      mapDispatchToPropsDefinitionPath,
      mapStateToPropsName = settings.mapStateToPropsName,
      mergePropsDefinitionPath
    } = this.details;

    if (!hasMapStateToPropsDefinition) {
      const mapStateToPropsAst = createMapStateToPropsFunctionAst(mapStateToPropsName);
      insertNodeAfterOrBefore(mapStateToPropsAst, [], [
        mapDispatchToPropsDefinitionPath,
        mergePropsDefinitionPath,
        furthestConnectAncestorPath
      ]);
    }

    connectArguments[0] = identifier(mapStateToPropsName);

    return this;
  }

  connectDispatch() {
    this.wrapWithConnectHocIfNeeded();
    this.updateDetails();
    const {
      connectArguments,
      furthestConnectAncestorPath,
      hasMapDispatchToPropsDefinition,
      mapDispatchToPropsName = settings.mapDispatchToPropsName,
      mapStateToPropsDefinitionPath,
      mergePropsDefinitionPath
    } = this.details;

    if (!hasMapDispatchToPropsDefinition) {
      const mapDispatchToPropsAst = createMapDispatchToPropsFunctionAst(mapDispatchToPropsName);
      insertNodeAfterOrBefore(
        mapDispatchToPropsAst,
        [ mapStateToPropsDefinitionPath ],
        [ mergePropsDefinitionPath, furthestConnectAncestorPath ]
      );
    }
    if (connectArguments.length === 0) {
      connectArguments.push(nullLiteral());
    }
    connectArguments[1] = identifier(mapDispatchToPropsName);
    return this;
  }

  connectMergeProps() {
    this.wrapWithConnectHocIfNeeded();
    this.updateDetails();
    const {
      connectArguments,
      furthestConnectAncestorPath,
      hasMergePropsDefinition,
      mapStateToPropsDefinitionPath,
      mapDispatchToPropsDefinitionPath,
      mergePropsName = settings.mergePropsName
    } = this.details;

    if (!hasMergePropsDefinition) {
      const mergePropsDefinitionAst = createMergePropsFunctionAst(mergePropsName);
      insertNodeAfterOrBefore(
        mergePropsDefinitionAst,
        [ mapDispatchToPropsDefinitionPath, mapStateToPropsDefinitionPath ],
        [ furthestConnectAncestorPath ]
      );
    }

    while (connectArguments.length < 2) {
      connectArguments.push(nullLiteral());
    }
    connectArguments[2] = identifier(mergePropsName);

    return this;
  }

  disconnect() {
    this.updateDetails();
    const { mapStateToPropsName, mapDispatchToPropsName, mergePropsName, scope } = this.details;
    if (scope) {
      removeBinding(scope, mapStateToPropsName);
      removeBinding(scope, mapDispatchToPropsName);
      removeBinding(scope, mergePropsName);
    }
    this.unwrapConnect();
    return this;
  }

  disconnectState() {
    this.updateDetails();
    const { connectCallExpressionPath, hasMapStateToProps, mapStateToPropsName, scope } = this.details;
    if (hasMapStateToProps) {
      removeBinding(scope, mapStateToPropsName);
      connectCallExpressionPath.node.arguments[0] = nullLiteral();
      this.cleanConnect();
    }
    return this;
  }

  disconnectDispatch() {
    this.updateDetails();
    const { connectCallExpressionPath, hasMapDispatchToProps, mapDispatchToPropsName, scope } = this.details;
    if (hasMapDispatchToProps) {
      removeBinding(scope, mapDispatchToPropsName);
      connectCallExpressionPath.node.arguments[1] = nullLiteral();
      this.cleanConnect();
    }
    return this;
  }

  disconnectMergeProps() {
    this.updateDetails();
    const { connectCallExpressionPath, hasMergeProps, mergePropsName, scope } = this.details;
    if (hasMergeProps) {
      removeBinding(scope, mergePropsName);
      connectCallExpressionPath.node.arguments[2] = nullLiteral();
      this.cleanConnect();
    }
    return this;
  }

  build() {
    return parser.print(this.ast);
  }
}

module.exports = ReduxConnectBuilder;
