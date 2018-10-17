const traverse = require('@babel/traverse').default;
const { expressionStatement, updateExpression, identifier } = require('@babel/types');
const parser = require('../../utils/parser');
const { insertNodeAfterOrBefore } = require('../../utils');

describe('utils:insertNodeAfterOrBefore', () => {
  const input = [
    'const add = (a, b) => {',
    '  a++;',
    '  return a + b;',
    '};'
  ].join('\n');
  const output = [
    'const add = (a, b) => {',
    '  a++;',
    '  b++;',
    '  return a + b;',
    '};'
  ].join('\n');
  const nodeToInsert = expressionStatement(updateExpression('++', identifier('b')));

  it('should not insert node when no path is found', () => {
    const ast = parser.parse(input);
    let assignmentExpressionPath = null;
    traverse(ast, {
      AssignmentExpression(path) {
        assignmentExpressionPath = path;
      }
    });
    insertNodeAfterOrBefore(nodeToInsert, [ assignmentExpressionPath ], [ assignmentExpressionPath ]);
    expect(parser.print(ast)).toEqual(input);
  });

  it('should insert node after specified path', () => {
    const ast = parser.parse(input);
    let updateExpressionPath = null;
    traverse(ast, {
      UpdateExpression(path) {
        updateExpressionPath = path;
      }
    });
    insertNodeAfterOrBefore(nodeToInsert, [ updateExpressionPath ], []);
    expect(parser.print(ast)).toEqual(output);
  });

  it('should insert node after specified path', () => {
    const ast = parser.parse(input);
    let returnStatementPath = null;
    traverse(ast, {
      ReturnStatement(path) {
        returnStatementPath = path;
      }
    });
    insertNodeAfterOrBefore(nodeToInsert, [], [ returnStatementPath ]);
    expect(parser.print(ast)).toEqual(output);
  });
});
