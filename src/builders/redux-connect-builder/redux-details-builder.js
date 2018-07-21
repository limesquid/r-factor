const traverse = require('@babel/traverse').default;
const {
  getFurthestAncestorInScope,
  isArrowFunctionDeclaration,
  isObjectDeclaration
} = require('../../utils/ast');
const {
  checkMapStateToProps,
  checkMapDispatchToProps,
  checkMergeProps
} = require('./utils');

class ReduxDetailsBuilder {
  constructor(ast) {
    this.objectsDeclarationsMap = {};
    this.functionsDeclarationsMap = {};
    this.connectCallExpressionPath = null;
    this.hasMapStateToProps = false;
    this.hasMapDispatchToProps = false;
    this.hasMergeProps = false;
    this.hasMapStateToPropsDefinition = false;
    this.hasMapDispatchToPropsDefinition = false;
    this.hasMergePropsDefinition = false;
    this.mapStateToPropsName = undefined;
    this.mapDispatchToPropsName = undefined;
    this.mergePropsName = undefined;
    this.gatherDetails(ast);
  }

  gatherDetails(ast) {
    // eslint-disable-next-line
    const that = this;
    traverse(ast, {
      FunctionDeclaration(path) {
        const { node } = path;
        that.functionsDeclarationsMap[node.id.name] = path;
      },
      VariableDeclaration(path) {
        const { node } = path;
        const [ declaration ] = node.declarations;
        const name = declaration.id.name;
        if (isArrowFunctionDeclaration(node)) {
          that.functionsDeclarationsMap[name] = path;
          return;
        }

        if (isObjectDeclaration(node)) {
          that.objectsDeclarationsMap[name] = path;
        }
      },
      CallExpression(path) {
        const { node } = path;
        if (node.callee.name === 'connect') {
          that.connectCallExpressionPath = path;
          const connectArguments = path.node.arguments;

          that.hasMapStateToProps = checkMapStateToProps(connectArguments);
          that.mapStateToPropsName = that.hasMapStateToProps ? connectArguments[0].name : undefined;
          that.hasMapStateToPropsDefinition = Boolean(
            that.mapStateToPropsName && path.scope.hasBinding(that.mapStateToPropsName)
          );

          that.hasMapDispatchToProps = checkMapDispatchToProps(connectArguments);
          that.mapDispatchToPropsName = that.hasMapDispatchToProps ? connectArguments[1].name : undefined;
          that.hasMapDispatchToPropsDefinition = Boolean(
            that.mapDispatchToPropsName && path.scope.hasBinding(that.mapDispatchToPropsName)
          );

          that.hasMergeProps = checkMergeProps(connectArguments);
          that.mergePropsName = that.hasMergeProps ? connectArguments[2].name : undefined;
          that.hasMergePropsDefinition = Boolean(
            that.hasMergeProps && path.scope.hasBinding(that.mergePropsName)
          );
        }
      }
    });
  }

  getDetails() {
    const isConnected = Boolean(this.connectCallExpressionPath);
    const furthestConnectAncestorPath = isConnected && getFurthestAncestorInScope(this.connectCallExpressionPath);
    const connectArguments = isConnected && this.connectCallExpressionPath.node.arguments;
    const mapStateToPropsDefinitionPath = this.mapStateToPropsName
      && this.functionsDeclarationsMap[this.mapStateToPropsName];
    const mapDispatchToPropsDefinitionPath = this.mapDispatchToPropsName && (
      this.functionsDeclarationsMap[this.mapDispatchToPropsName]
      || this.objectsDeclarationsMap[this.mapDispatchToPropsName]
    );
    const mergePropsDefinitionPath = this.mergePropsName
      && this.functionsDeclarationsMap[this.mergePropsName];

    return {
      connectArguments,
      connectCallExpressionPath: this.connectCallExpressionPath,
      furthestConnectAncestorPath,
      isConnected,
      hasMapDispatchToProps: this.hasMapDispatchToProps,
      hasMapDispatchToPropsDefinition: this.hasMapDispatchToPropsDefinition,
      hasMapStateToProps: this.hasMapStateToProps,
      hasMapStateToPropsDefinition: this.hasMapStateToPropsDefinition,
      hasMergeProps: this.hasMergeProps,
      hasMergePropsDefinition: this.hasMergePropsDefinition,
      mapStateToPropsDefinitionPath,
      mapStateToPropsName: this.mapStateToPropsName,
      mapDispatchToPropsName: this.mapDispatchToPropsName,
      mapDispatchToPropsDefinitionPath,
      mergePropsDefinitionPath,
      mergePropsName: this.mergePropsName,
      scope: this.connectCallExpressionPath.scope
    };
  }
}

module.exports = ReduxDetailsBuilder;
