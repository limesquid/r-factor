const { isNullLiteral } = require('@babel/types');
const traverse = require('@babel/traverse').default;
const {
  isArrowFunctionDeclaration,
  isObjectDeclaration,
  isUndefinedIdentifier
} = require('../ast');
const parser = require('../parser');
const settings = require('../../settings');

const checkMapStateToProps = (connectArguments) =>
  connectArguments.length > 0
  && !isNullLiteral(connectArguments[0])
  && !isUndefinedIdentifier(connectArguments[0]);

const checkMapDispatchToProps = (connectArguments) =>
  connectArguments.length > 1
  && !isNullLiteral(connectArguments[1])
  && !isUndefinedIdentifier(connectArguments[1]);

const getDetails = (ast) => {
  const objectsDeclarationsMap = {};
  const functionsDeclarationsMap = {};
  let connectCallExpressionPath = null;
  let hasMapStateToProps = false;
  let hasMapDispatchToProps = false;
  let hasMapStateToPropsDefinition = false;
  let hasMapDispatchToPropsDefinition = false;
  let mapStateToPropsName = null;
  let mapDispatchToPropsName = null;

  traverse(ast, {
    FunctionDeclaration(path) {
      const { node } = path;
      functionsDeclarationsMap[node.id.name] = path;
    },
    VariableDeclaration(path) {
      const { node } = path;
      const [ declaration ] = node.declarations;
      const name = declaration.id.name;
      if (isArrowFunctionDeclaration(node)) {
        functionsDeclarationsMap[name] = path;
        return;
      }

      if (isObjectDeclaration(node)) {
        objectsDeclarationsMap[name] = path;
      }
    },
    CallExpression(path) {
      const { node } = path;
      if (node.callee.name === 'connect') {
        connectCallExpressionPath = path;
        const connectArguments = path.node.arguments;

        hasMapStateToProps = checkMapStateToProps(connectArguments);
        mapStateToPropsName = hasMapStateToProps ? connectArguments[0].name : undefined;
        hasMapStateToPropsDefinition = Boolean(mapStateToPropsName && path.scope.hasBinding(mapStateToPropsName));

        hasMapDispatchToProps = checkMapDispatchToProps(connectArguments);
        mapDispatchToPropsName = hasMapDispatchToProps ? connectArguments[1].name : undefined;
        hasMapDispatchToPropsDefinition = Boolean(
          mapDispatchToPropsName && path.scope.hasBinding(mapDispatchToPropsName)
        );
      }
    }
  });

  const isConnected = Boolean(connectCallExpressionPath);
  const connectArguments = isConnected && connectCallExpressionPath.node.arguments;
  const hasMergeProps = isConnected && connectArguments > 2;

  const mapDispatchToPropsDefinitionPath = mapDispatchToPropsName && (
    functionsDeclarationsMap[mapDispatchToPropsName] || objectsDeclarationsMap[mapDispatchToPropsName]
  );

  return {
    connectArguments,
    connectCallExpressionPath,
    isConnected,
    hasMapDispatchToProps,
    hasMapStateToPropsDefinition,
    hasMapStateToProps,
    hasMapStateToPropsDefinition,
    hasMergeProps,
    mapStateToPropsName,
    mapDispatchToPropsName,
    mapDispatchToPropsDefinitionPath
  };
};

const createMapStateToPropsFunctionAst = (functionName = 'mapStateToProps') => {
  const { semicolon, doubleEndOfLine } = settings;
  let code = '';
  code += doubleEndOfLine;
  code += `const ${functionName} = (state) => ({})${semicolon}`;
  console.log(code);
  return parser.parse(code).program.body;
};

module.exports = {
  createMapStateToPropsFunctionAst,
  getDetails
};
