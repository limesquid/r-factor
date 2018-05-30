const { generateIndent, getIndent, indentCode, indentLines } = require('../utils');

describe('utils', () => {
  it('getIndent', () => {
    const tests = [
      { input: [ '  asd', 2 ], output: 2 },
      { input: [ '    asd', 4 ], output: 4 }
    ];
    tests.forEach(({ input, output }) => expect(getIndent(...input)).toEqual(output));
  });

  it('generateIndent', () => {
    const tests = [
      { input: -1, output: '' },
      { input: 0, output: '' },
      { input: 1, output: ' ' },
      { input: 2, output: '  ' }
    ];
    tests.forEach(({ input, output }) => expect(generateIndent(input)).toEqual(output));
  });

  it('indentLines', () => {
    const tests = [
      { input: [ '  23' ], output: [ '23' ] },
      { input: [ '   21' ], output: [ ' 21' ] },
      { input: [ ' 23' ], output: [ ' 23' ] }
    ];
    tests.forEach(({ input, output }) => expect(indentLines(input, -2)).toEqual(output));
  });

  it('indentCode', () => {
    const tests = [
      { input: [ '23', 1 ], output: ' 23' },
      { input: [ '23\n45', 3 ], output: '   23\n   45' }
    ];
    tests.forEach(({ input, output }) => expect(indentCode(...input)).toEqual(output));
  });
});
