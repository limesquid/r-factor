const { Refactoring } = require('../model');
const parser = require('../utils/parser');

describe('errors', () => {
  const transformation = (code) => code;
  const brokenTransformation = () => {
    throw new Error('transformation error');
  };

  it('returns custom error message when unable to parse code', () => {
    const code = 'const invalidJs = {';
    const refactoring = new Refactoring(parser, [ transformation ]);
    expect(refactoring.refactor(code)).toEqual(
      expect.stringContaining('Parsing failure - syntax error')
    );
  });

  it('returns error message transformation fails', () => {
    const code = 'const validJs = {};';
    const refactoring = new Refactoring(parser, [ brokenTransformation ]);
    expect(refactoring.refactor(code)).toEqual(
      expect.stringContaining('transformation error')
    );
  });
});
