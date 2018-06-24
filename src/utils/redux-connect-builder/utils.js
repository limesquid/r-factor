const { isNullLiteral } = require('@babel/types');
const traverse = require('@babel/traverse').default;
const {
  getFurthestAncestorInScope,
  isArrowFunctionDeclaration,
  isObjectDeclaration,
  isUndefinedIdentifier
} = require('../ast');
const { indentCode } = require('../index');
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

const checkMergeProps = (connectArguments) => connectArguments.length > 2;

const getDetails = (ast) => {
  const objectsDeclarationsMap = {};
  const functionsDeclarationsMap = {};
  let connectCallExpressionPath = null;
  let hasMapStateToProps = false;
  let hasMapDispatchToProps = false;
  let hasMergePropsToProps = false;
  let hasMapStateToPropsDefinition = false;
  let hasMapDispatchToPropsDefinition = false;
  let hasMergePropsToPropsDefinition = false;
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
  const { semicolon, doubleEndOfLine, mapStateToPropsName } = settings;
  const mapStateToPropsFunctionName = functionName || mapStateToPropsName || 'mapStateToProps';
  let code = '';
  code += doubleEndOfLine;
  code += `const ${mapStateToPropsFunctionName} = (state) => ({})${semicolon}`;
  return parser.parse(code).program.body;
};

const createMapDispatchToPropsFunctionAst = (functionName) => {
  const { semicolon, doubleEndOfLine, mapDispatchToPropsName } = settings;
  const mapDispatchToPropsFunctionName = functionName || mapDispatchToPropsName || 'mapStateToProps';
  let code = '';
  code += doubleEndOfLine;
  code += `const ${mapDispatchToPropsFunctionName} = {}${semicolon}`;
  return parser.parse(code).program.body;
};

const createMergePropsFunctionAst = (functionName) => {
  const { doubleEndOfLine, endOfLine, indent, semicolon, mergePropsName } = settings;
  const mergePropsFunctionName = functionName || mergePropsName || 'mergeProps';
  let code = '';
  code += `const ${mergePropsFunctionName} = (stateProps, dispatchProps, ownProps) => ({` + endOfLine;
  code += indentCode([
    '...stateProps,',
    '...dispatchProps,',
    '...ownProps',
  ].join(endOfLine), indent);
  code += endOfLine;
  code += '});';

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
  createMapDispatchToPropsFunctionAst,
  createMapStateToPropsFunctionAst,
  createMergePropsFunctionAst,
  getDetails,
  insertNodeAfterOrBefore
};
