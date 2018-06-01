const { readFile } = require('./test-utils');
const SortAttributes = require('../refactorings/sort-attributes');

const files = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 ].map((n) => `file${n}`);

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
});
