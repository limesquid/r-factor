const settings = require('../settings');
const { range, readFile } = require('./test-utils');
const SortAttributes = require('../refactorings/sort-attributes');

const files = [
  ...range(1, 16).map((n) => `file${n}`),
  ...range(1, 1).map((n) => `preserve-comments${n}`)
];

describe('sort-attributes:canApply', () => {
  const refactoring = new SortAttributes();
  const tests = files.map((file) => ({
    name: `sort-attributes/input/${file}.js`,
    input: readFile(`sort-attributes/input/${file}.js`),
    output: true
  }));
  tests.push({
    name: 'class',
    input: 'class X {}',
    output: false
  });
  tests.forEach(({ name, input, output }) => {
    it(`canApply "${name}"`, () => {
      expect(refactoring.canApply(input)).toBe(output);
    });
  });
});

describe('sort-attributes:refactor', () => {
  const refactoring = new SortAttributes();
  const tests = files.map((file) => ({
    name: `sort-attributes/input/${file}.js -> sort-attributes/output/${file}.js`,
    input: readFile(`sort-attributes/input/${file}.js`),
    output: readFile(`sort-attributes/output/${file}.js`)
  }));
  tests.forEach(({ name, input, output }) => {
    it(`refactor "${name}"`, () => {
      expect(refactoring.refactor(input)).toBe(output);
    });
  });

  it('refactor with trailing commas enabled', () => {
    settings.set({ 'trailing-commas': true });
    const input = readFile('sort-attributes/input/trailing-comma.js');
    const output = readFile('sort-attributes/output/trailing-comma.js');
    expect(refactoring.refactor(input)).toBe(output);
    settings.revert();
  });
});
