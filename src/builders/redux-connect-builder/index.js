const { identifier, nullLiteral } = require('@babel/types');
const parser = require('../../utils/parser');
const settings = require('../../settings');
const wrapComponent = require('../../transformations/wrap-component');
const unwrapComponent = require('../../transformations/unwrap-component');
const {
  checkIsConnected,
  createMapDispatchToPropsFunctionAst,
  createMapStateToPropsFunctionAst,
  createMergePropsFunctionAst,
  insertNodeAfterOrBefore
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
        subImports: { connect: 'connect' }
      }
    });
    this.ast = parser.parse(this.code);
    this.isConnected = true;
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
      isConnected,
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

    if (isConnected) {
      connectArguments[0] = identifier(mapStateToPropsName);
    }
    return this;
  }

  connectDispatch() {
    this.wrapWithConnectHocIfNeeded();
    this.updateDetails();
    const {
      connectArguments,
      furthestConnectAncestorPath,
      hasMapDispatchToPropsDefinition,
      hasMapDispatchToProps,
      isConnected,
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

    if (isConnected) {
      if (!hasMapDispatchToProps) {
        connectArguments.push(nullLiteral());
      }
      connectArguments[1] = identifier(mapDispatchToPropsName);
    }
    return this;
  }

  connectMergeProps() {
    this.wrapWithConnectHocIfNeeded();
    this.updateDetails();
    const {
      connectArguments,
      furthestConnectAncestorPath,
      hasMergePropsDefinition,
      isConnected,
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

    if (isConnected) {
      while (connectArguments.length < 2) {
        connectArguments.push(nullLiteral());
      }
      connectArguments[2] = identifier(mergePropsName);
    }

    return this;
  }

  disconnect() {
    this.updateDetails();
    this.code = unwrapComponent(this.code, this.ast, {
      name: 'connect',
      import: {
        module: 'react-redux',
        removeImportIfEmpty: true,
        subImports: [ 'connect' ]
      }
    });
    this.ast = parser.parse(this.code);
  }

  disconnectState() {

  }

  disconnectDispatch() {

  }

  disconnectMergeProps() {

  }

  build() {
    return parser.print(this.ast);
  }
}

module.exports = ReduxConnectBuilder;
