const { range, readFile } = require('./test-utils');
const AddClassname = require('../refactorings/add-classname');

const files = [
  ...range(1, 22).map((n) => `functional/file${n}`),
  ...range(1, 22).map((n) => `non-functional/file${n}`),
  'functional/alerts'
];

describe('add-classname:canApply', () => {
  const refactoring = new AddClassname();
  const tests = files.map((file) => ({
    name: `add-classname/input/${file}.js`,
    input: readFile(`add-classname/input/${file}.js`),
    output: true
  }));
  tests.push(
    {
      name: 'class',
      input: 'class X {}',
      output: false
    },
    {
      name: 'no-jsx',
      input: readFile('add-classname/input/functional/no-jsx.js'),
      output: false
    }
  );
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
    it(`should not modify refactored code "${name}"`, () => {
      expect(refactoring.refactor(output)).toBe(output);
    });
  });
});
