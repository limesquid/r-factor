const { isNullLiteral } = require('@babel/types');
const traverse = require('@babel/traverse').default;
const { isUndefinedIdentifier } = require('../../utils/ast');
const { indentCode, indentLine } = require('../../utils');
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
};

const createMapStateToPropsFunctionAst = (functionName) => {
  const { doubleEndOfLine, endOfLine, indent, semicolon } = settings;
  let code = '';
  code += doubleEndOfLine;
  code += `const ${functionName} = (state) => ({`;
  code += endOfLine;
  code += indentLine('', indent);
  code += endOfLine;
  code += `})${semicolon}`;
  return parser.parse(code).program.body;
};

const createMapDispatchToPropsFunctionAst = (functionName) => {
  const { doubleEndOfLine, endOfLine, mapToDispatchPreferObject, indent, semicolon } = settings;
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
  if (pathToInsertAfter) {
    pathToInsertAfter.insertAfter(node);
    return;
  }

  const pathToInsertBefore = beforePaths.find(Boolean);
  if (pathToInsertBefore) {
    pathToInsertBefore.insertBefore(node);
  }
};

module.exports = {
  checkMapStateToProps,
  checkMapDispatchToProps,
  checkMergeProps,
  checkIsConnected,
  createMapDispatchToPropsFunctionAst,
  createMapStateToPropsFunctionAst,
  createMergePropsFunctionAst,
  insertNodeAfterOrBefore
};
