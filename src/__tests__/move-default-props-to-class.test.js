const { range, readFile } = require('./test-utils');
const MoveDefaultPropsToClass = require('../refactorings/move-default-props-to-class');

const files = range(1, 3).map((n) => `button${n}`);

describe('move-default-props-to-class:canApply', () => {
  const refactoring = new MoveDefaultPropsToClass();
  const tests = files.map((file) => ({
    name: `default-props/outside/${file}.js`,
    input: readFile(`default-props/outside/${file}.js`),
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

describe('move-default-props-to-class:refactor', () => {
  const refactoring = new MoveDefaultPropsToClass();
  const tests = files.map((file) => ({
    name: `default-props/outside/${file}.js -> default-props/inside/${file}.js`,
    input: readFile(`default-props/outside/${file}.js`),
    output: readFile(`default-props/inside/${file}.js`)
  }));
  tests.forEach(({ name, input, output }) => {
    it(`refactor "${name}"`, () => {
      expect(refactoring.refactor(input)).toBe(output);
    });
  });
});
