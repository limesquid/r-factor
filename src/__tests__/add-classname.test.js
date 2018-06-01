const { readFile } = require('./test-utils');
const AddClassname = require('../refactorings/add-classname');

const files = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17 ].map((n) => `file${n}`);

describe('add-classname:canApply', () => {
  const refactoring = new AddClassname();
  const tests = files.map((file) => ({
    name: `add-classname/input/${file}.js`,
    input: readFile(`add-classname/input/${file}.js`),
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

describe('add-classname:refactor', () => {
  const refactoring = new AddClassname();
  const tests = files.map((file) => ({
    name: `add-classname/input/${file}.js -> add-classname/output/${file}.js`,
    input: readFile(`add-classname/input/${file}.js`),
    output: readFile(`add-classname/output/${file}.js`)
  }));
  tests.forEach(({ name, input, output }) => {
    it(`refactor "${name}"`, () => {
      expect(refactoring.refactor(input)).toBe(output);
    });
  });
});
