class ReduxConnectBuilder {
  constructor(code, ast) {
    this.code = code;
    this.ast = ast;
  }

  connectState() {

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
    return this.code;
  }
}

module.exports = ReduxConnectBuilder;
