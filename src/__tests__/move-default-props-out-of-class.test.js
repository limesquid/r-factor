const { range, readFile } = require('./test-utils');
const MoveDefaultPropsOutOfClass = require('../refactorings/move-default-props-out-of-class');

const files = range(1, 3).map((n) => `button${n}`);

describe('move-default-props-out-of-class:canApply', () => {
  const refactoring = new MoveDefaultPropsOutOfClass();
  const tests = files.map((file) => ({
    name: `default-props/inside/${file}.js`,
    input: readFile(`default-props/inside/${file}.js`),
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

describe('move-default-props-out-of-class:refactor', () => {
  const refactoring = new MoveDefaultPropsOutOfClass();
  const tests = files.map((file) => ({
    name: `default-props/inside/${file}.js -> default-props/outside/${file}.js`,
    input: readFile(`default-props/inside/${file}.js`),
    output: readFile(`default-props/outside/${file}.js`)
  }));
  tests.forEach(({ name, input, output }) => {
    it(`refactor "${name}"`, () => {
      expect(refactoring.refactor(input)).toBe(output);
    });
  });
});
