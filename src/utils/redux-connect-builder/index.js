const { identifier, nullLiteral } = require('@babel/types');
const parser = require('../parser');
const {
  createMapDispatchToPropsFunctionAst,
  createMapStateToPropsFunctionAst,
  createMergePropsFunctionAst,
  getDetails,
  insertNodeAfterOrBefore
} = require('./utils');

class ReduxConnectBuilder {
  constructor(code, ast) {
    this.ast = ast || parser.parse(ast);
  }

  refresh() {
    this.details = getDetails(this.ast);
  }

  connect() {
    this.connectState();
    this.connectDispatch();
  }

  connectState() {
    this.refresh();
    const {
      connectArguments,
      furthestConnectAncestorPath,
      hasMapStateToPropsDefinition,
      isConnected,
      mapDispatchToPropsDefinitionPath,
      mapStateToPropsName = 'mapStateToProps',
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
  }

  connectDispatch() {
    this.refresh();
    const {
      connectArguments,
      furthestConnectAncestorPath,
      hasMapDispatchToPropsDefinition,
      hasMapDispatchToProps,
      isConnected,
      mapDispatchToPropsName = 'mapDispatchToProps',
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
      connectArguments[1] = identifier(mapDispatchToPropsName);
    }
  }

  connectMergeProps() {
    this.refresh();
    const {
      connectArguments,
      furthestConnectAncestorPath,
      isConnected,
      mapStateToPropsDefinitionPath,
      mapDispatchToPropsDefinitionPath,
      mergePropsDefinitionPath,
      mergePropsName = 'mergeProps'
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
      while(connectArguments.length < 2) {
        connectArguments.push(nullLiteral());
      }
      connectArguments[2] = identifier(mergePropsName);
      console.log(connectArguments);
    }
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
