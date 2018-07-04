const { identifier, nullLiteral } = require('@babel/types');
const parser = require('../../utils/parser');
const settings = require('../../settings');
const wrapComponent = require('../../transformations/wrap-component');
const {
  checkIsConnected,
  createMapDispatchToPropsFunctionAst,
  createMapStateToPropsFunctionAst,
  createMergePropsFunctionAst,
  getDetails,
  insertNodeAfterOrBefore
} = require('./utils');

class ReduxConnectBuilder {
  constructor(code, ast) {
    this.code = code;
    this.ast = ast || parser.parse(code);
    this.isConnected = checkIsConnected(this.ast);
  }

  refresh() {
    this.details = getDetails(this.ast);
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
    this.refresh();
  }

  connect() {
    this.connectState();
    this.connectDispatch();
    return this;
  }

  connectState() {
    this.wrapWithConnectHocIfNeeded();
    this.refresh();
    const {
      connectArguments,
      furthestConnectAncestorPath,
      hasMapStateToPropsDefinition,
      isConnected,
      mapDispatchToPropsDefinitionPath,
      mapStateToPropsName = settings.mapStateToPropsName || 'mapStateToProps',
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
    this.refresh();
    const {
      connectArguments,
      furthestConnectAncestorPath,
      hasMapDispatchToPropsDefinition,
      hasMapDispatchToProps,
      isConnected,
      mapDispatchToPropsName = settings.mapDispatchToPropsName || 'mapStateToProps',
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
    this.refresh();
    const {
      connectArguments,
      furthestConnectAncestorPath,
      hasMergePropsDefinition,
      isConnected,
      mapStateToPropsDefinitionPath,
      mapDispatchToPropsDefinitionPath,
      mergePropsName = settings.mergePropsName || 'mergeProps'
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
