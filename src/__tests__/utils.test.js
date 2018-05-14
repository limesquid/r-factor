const { indentLines } = require('../utils');

describe('utils', () => {
  it('indentLines', () => {
    const tests = [
      { input: [ '  23' ], output: [ '23' ] },
      { input: [ '   21' ], output: [ ' 21' ] },
      { input: [ ' 23' ], output: [ ' 23' ] }
    ];
    tests.forEach(({ input, output }) => expect(indentLines(input, -2)).toEqual(output));
  });
});
