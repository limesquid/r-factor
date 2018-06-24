const { identifier } = require('@babel/types');
const parser = require('../parser');
const {
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
  }

  connectState() {
    const {
      connectArguments,
      furthestConnectAncestorPath,
      isConnected,
      mapDispatchToPropsDefinitionPath,
      mapStateToPropsName = 'mapStateToProps'
    } = this.details;

    if (isConnected) {
      connectArguments[0] = identifier(mapStateToPropsName);
    }

    if (!this.details.hasMapStateToPropsDefinition) {
      const mapStateToPropsAst = createMapStateToPropsFunctionAst(mapStateToPropsName);
      insertNodeBeforeFirstExistingPath(mapStateToPropsAst, [
        mapDispatchToPropsDefinitionPath,
        furthestConnectAncestorPath
      ]);
    }
  }

  connectDispatch() {

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
