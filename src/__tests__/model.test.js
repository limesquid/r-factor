const { Builder, Refactoring } = require('../model');

describe('model:Builder', () => {
  it(`build`, () => {
    const code = 'asdad';
    const builder = new Builder(code);
    expect(builder.build()).toBe(code);
  });
});

describe('model:Refactoring', () => {
  const refactoring = new Refactoring();
  const code = 'asdad';

  it(`canApply`, () => {
    expect(refactoring.canApply(code)).toBe(false);
  });

  it(`refactor`, () => {
    expect(refactoring.refactor(code)).toBe(code);
  });
});
