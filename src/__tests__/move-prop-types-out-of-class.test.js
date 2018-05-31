const { readFile } = require('./test-utils');
const MovePropTypesOutOfClass = require('../move-prop-types-out-of-class');

const files = [ 1, 2, 3, 4 ].map((n) => `button${n}`);

describe('move-prop-types-out-of-class:canApply', () => {
  const refactoring = new MovePropTypesOutOfClass();
  const tests = files.map((file) => ({
    name: `prop-types/inside/${file}.js`,
    input: readFile(`prop-types/inside/${file}.js`),
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

describe('move-prop-types-out-of-class:refactor', () => {
  const refactoring = new MovePropTypesOutOfClass();
  const tests = files.map((file) => ({
    name: `prop-types/inside/${file}.js -> prop-types/outside/${file}.js`,
    input: readFile(`prop-types/inside/${file}.js`),
    output: readFile(`prop-types/outside/${file}.js`)
  }));
  tests.forEach(({ name, input, output }) => {
    it(`refactor "${name}"`, () => {
      expect(refactoring.refactor(input)).toBe(output);
    });
  });
});
