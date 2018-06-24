const { identifier } = require('@babel/types');
const parser = require('../parser');
const {
  createMapDispatchToPropsFunctionAst,
  createMapStateToPropsFunctionAst,
  getDetails,
  insertNodeAfterOrBefore
} = require('./utils');

class ReduxConnectBuilder {
  constructor(code, ast) {
    this.ast = ast || parser.parse(ast);
    this.details = getDetails(this.ast);
  }

  refresh() {
    this.details = getDetails(this.ast);
  }

  connect() {
    this.connectState();
    this.refresh();
    this.connectDispatch();
  }

  connectState() {
    const {
      connectArguments,
      furthestConnectAncestorPath,
      hasMapStateToPropsDefinition,
      isConnected,
      mapDispatchToPropsDefinitionPath,
      mapStateToPropsName = 'mapStateToProps'
    } = this.details;

    if (!hasMapStateToPropsDefinition) {
      const mapStateToPropsAst = createMapStateToPropsFunctionAst(mapStateToPropsName);
      insertNodeAfterOrBefore(mapStateToPropsAst, [], [
        mapDispatchToPropsDefinitionPath,
        furthestConnectAncestorPath
      ]);
    }

    if (isConnected) {
      connectArguments[0] = identifier(mapStateToPropsName);
    }
  }

  connectDispatch() {
    const {
      connectArguments,
      furthestConnectAncestorPath,
      hasMapDispatchToPropsDefinition,
      hasMapDispatchToProps,
      isConnected,
      mapDispatchToPropsName = 'mapDispatchToProps',
      mapStateToPropsDefinitionPath,
      mergePropDefinitionPath
    } = this.details;

    if (!hasMapDispatchToPropsDefinition) {
      const mapDispatchToPropsAst = createMapDispatchToPropsFunctionAst(mapDispatchToPropsName);
      const isInserted = insertNodeAfterOrBefore(
        mapDispatchToPropsAst,
        [ mapStateToPropsDefinitionPath ],
        [ mergePropDefinitionPath, furthestConnectAncestorPath ]
      );
    }

    if (isConnected) {
      connectArguments[1] = identifier(mapDispatchToPropsName);
    }
  }

  connectMergeProps() {
    const {
      connectArguments,
      mergePropDefinitionPath

    } = this.details;
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
