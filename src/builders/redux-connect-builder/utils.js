const { isNullLiteral } = require('@babel/types');
const traverse = require('@babel/traverse').default;
const {
  getFurthestAncestorInScope,
  isArrowFunctionDeclaration,
  isObjectDeclaration,
  isUndefinedIdentifier
} = require('../../utils/ast');
const { indentCode } = require('../../utils');
const parser = require('../../utils/parser');
const settings = require('../../settings');

const checkMapStateToProps = (connectArguments) =>
  connectArguments.length > 0
  && !isNullLiteral(connectArguments[0])
  && !isUndefinedIdentifier(connectArguments[0]);

const checkMapDispatchToProps = (connectArguments) =>
  connectArguments.length > 1
  && !isNullLiteral(connectArguments[1])
  && !isUndefinedIdentifier(connectArguments[1]);

const checkMergeProps = (connectArguments) => connectArguments.length > 2;

const checkIsConnected = (ast) => {
  let isConnected = false;
  traverse(ast, {
    CallExpression(path) {
      if (path.node.callee.name === 'connect') {
        isConnected = true;
        path.stop();
      }
    }
  });
  return isConnected;
}

const getDetails = (ast) => {
  const objectsDeclarationsMap = {};
  const functionsDeclarationsMap = {};
  let connectCallExpressionPath = null;
  let hasMapStateToProps = false;
  let hasMapDispatchToProps = false;
  let hasMergeProps = false;
  let hasMapStateToPropsDefinition = false;
  let hasMapDispatchToPropsDefinition = false;
  let hasMergePropsDefinition = false;
  let mapStateToPropsName = null;
  let mapDispatchToPropsName = null;
  let mergePropsName = null;

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

        hasMergeProps = checkMergeProps(connectArguments);
        mergePropsName = hasMergeProps ? connectArguments[2].name : undefined;
        hasMergePropsDefinition = Boolean(hasMergeProps && path.scope.hasBinding(mergePropsName));
      }
    }
  });

  const isConnected = Boolean(connectCallExpressionPath);
  const furthestConnectAncestorPath = isConnected
    ? getFurthestAncestorInScope(connectCallExpressionPath)
    : null;
  const connectArguments = isConnected && connectCallExpressionPath.node.arguments;
  const mapStateToPropsDefinitionPath = mapStateToPropsName && functionsDeclarationsMap[mapStateToPropsName];
  const mapDispatchToPropsDefinitionPath = mapDispatchToPropsName && (
    functionsDeclarationsMap[mapDispatchToPropsName] || objectsDeclarationsMap[mapDispatchToPropsName]
  );
  const mergePropsDefinitionPath = mergePropsName && functionsDeclarationsMap[mergePropsName];

  return {
    connectArguments,
    connectCallExpressionPath,
    furthestConnectAncestorPath,
    isConnected,
    hasMapDispatchToProps,
    hasMapDispatchToPropsDefinition,
    hasMapStateToProps,
    hasMapStateToPropsDefinition,
    hasMergeProps,
    hasMergePropsDefinition,
    mapStateToPropsDefinitionPath,
    mapStateToPropsName,
    mapDispatchToPropsName,
    mapDispatchToPropsDefinitionPath,
    mergePropsDefinitionPath,
    mergePropsName
  };
};

const createMapStateToPropsFunctionAst = (functionName) => {
  const { doubleEndOfLine, mapToStatePreferOneLine, semicolon } = settings;
  let code = '';
  code += doubleEndOfLine;
  code += `const ${functionName} = (state) => ({`;
  code += !mapToStatePreferOneLine ? doubleEndOfLine : '';
  code += `})${semicolon}`;
  return parser.parse(code).program.body;
};

const createMapDispatchToPropsFunctionAst = (functionName) => {
  const { doubleEndOfLine, endOfLine, mapToDispatchPreferObject, semicolon } = settings;
  let code = '';
  code += doubleEndOfLine;
  if (mapToDispatchPreferObject) {
    code += `const ${functionName} = {}${semicolon}${endOfLine}`;
  } else {
    code += `const ${functionName} = (dispatch) => ({${endOfLine}`;
    code += endOfLine;
    code += `})${semicolon}${doubleEndOfLine}`;
  }
  return parser.parse(code).program.body;
};

const createMergePropsFunctionAst = (functionName) => {
  const { endOfLine, indent, semicolon } = settings;
  let code = '';
  code += `const ${functionName} = (stateProps, dispatchProps, ownProps) => ({`;
  code += endOfLine;
  code += indentCode([
    '...stateProps,',
    '...dispatchProps,',
    '...ownProps'
  ].join(endOfLine), indent);
  code += endOfLine;
  code += `})${semicolon}`;

  return parser.parse(code).program.body;
};

const insertNodeAfterOrBefore = (node, afterPaths, beforePaths) => {
  const pathToInsertAfter = afterPaths.find(Boolean);
  const pathToInsertBefore = beforePaths.find(Boolean);

  if (pathToInsertAfter) {
    pathToInsertAfter.insertAfter(node);
    return true;
  }

  if (pathToInsertBefore) {
    pathToInsertBefore.insertBefore(node);
    return true;
  }

  return false;
};

module.exports = {
  checkIsConnected,
  createMapDispatchToPropsFunctionAst,
  createMapStateToPropsFunctionAst,
  createMergePropsFunctionAst,
  getDetails,
  insertNodeAfterOrBefore
};
