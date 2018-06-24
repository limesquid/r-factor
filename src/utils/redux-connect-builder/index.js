const { identifier } = require('@babel/types');
const parser = require('../parser');
const {
  createMapStateToPropsFunctionAst,
  getDetails
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
      connectCallExpressionPath,
      connectArguments,
      isConnected,
      mapDispatchToPropsDefinitionPath,
      mapStateToPropsName
    } = this.details;

    if (isConnected && !mapStateToPropsName) {
      connectArguments[0] = identifier('mapStateToProps');
    }

    if (!this.details.hasMapStateToPropsDefinition) {
      const mapStateToPropsAst = createMapStateToPropsFunctionAst(mapStateToPropsName);
      mapDispatchToPropsDefinitionPath.insertBefore(mapStateToPropsAst);
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
