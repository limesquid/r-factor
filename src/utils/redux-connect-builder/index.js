const { identifier } = require('@babel/types');
const parser = require('../parser');
const {
  createMapDispatchToPropsFunctionAst,
  createMapStateToPropsFunctionAst,
  getDetails,
  insertNodeBeforeFirstExistingPath
} = require('./utils');

class ReduxConnectBuilder {
  constructor(code, ast) {
    this.code = code;
    this.ast = ast || parser.parse(ast);
    this.details = getDetails(this.ast);
  }

  connect() {
    this.connectState();
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
      insertNodeBeforeFirstExistingPath(mapStateToPropsAst, [
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
      mapDispatchToPropsName = 'mapDispatchToProps'
    } = this.details;

    if (!hasMapDispatchToPropsDefinition) {
      const mapDispatchToPropsAst = createMapDispatchToPropsFunctionAst(mapDispatchToPropsName);
      const isInserted = insertNodeBeforeFirstExistingPath(mapDispatchToPropsAst, [
        furthestConnectAncestorPath
      ]);
    }

    if (isConnected) {
      connectArguments[1] = identifier(mapDispatchToPropsName);
    }
  }

  connectMergeProps() {

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
