const { /*indentCode, */indentLines } = require('../utils');

const getLines = (code) => code.split('\n');
const generateIndent = (level, characters = '  ') => Array.from({ length: level }).map(() => characters).join('');
const removeIndent = (line) => line.replace(/^\s+/, '');
const indent = (line, level, characters) => `${generateIndent(level, characters)}${line}`;

const indentCode = (code, firstLineLevel, otherLinesLevel = firstLineLevel) => {
  const [ firstLine, ...otherLines ] = getLines(code);
  return [
    indent(firstLine, firstLineLevel),
    ...otherLines.map((line) => indent(line, otherLinesLevel))
  ].join('\n');
};

describe('utils', () => {
  it('generateIndent', () => {
    const tests = [
      { input: [ -1, ' ' ], output: '' },
      { input: [ 0, ' ' ], output: '' },
      { input: [ 1, ' ' ], output: ' ' },
      { input: [ 2, '  ' ], output: '    ' }
    ];
    tests.forEach(({ input, output }) => expect(generateIndent(...input)).toEqual(output));
  });

  it('removeIndent', () => {
    const tests = [
      { input: '', output: '' },
      { input: ' ', output: '' },
      { input: '  ', output: '' },
      { input: ' asd', output: 'asd' },
      { input: '       asd', output: 'asd' }
    ];
    tests.forEach(({ input, output }) => expect(removeIndent(input)).toEqual(output));
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
      { input: [ '23', 1, 2 ], output: '  23' },
      { input: [ '23\n45', 3, 2 ], output: '      23\n    45' }
    ];
    tests.forEach(({ input, output }) => expect(indentCode(...input)).toEqual(output));
  });
});
