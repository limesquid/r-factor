const { range, readFile } = require('./test-utils');
const MovePropTypesToClass = require('../refactorings/move-prop-types-to-class');

const files = range(1, 4).map((n) => `button${n}`);

describe('move-prop-types-to-class:canApply', () => {
  const refactoring = new MovePropTypesToClass();
  const tests = files.map((file) => ({
    name: `prop-types/outside/${file}.js`,
    input: readFile(`prop-types/outside/${file}.js`),
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

describe('move-prop-types-to-class:refactor', () => {
  const refactoring = new MovePropTypesToClass();
  const tests = files.map((file) => ({
    name: `prop-types/outside/${file}.js -> prop-types/inside/${file}.js`,
    input: readFile(`prop-types/outside/${file}.js`),
    output: readFile(`prop-types/inside/${file}.js`)
  }));
  tests.forEach(({ name, input, output }) => {
    it(`refactor "${name}"`, () => {
      expect(refactoring.refactor(input)).toBe(output);
    });
  });
});
