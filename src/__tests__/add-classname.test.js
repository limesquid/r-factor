const { range, readFile } = require('./test-utils');
const AddClassname = require('../refactorings/add-classname');
const settings = require('../settings');

const files = [
  ...range(1, 24).map((n) => `arrow/file${n}`),
  ...range(1, 23).map((n) => `class/file${n}`),
  ...range(1, 1).map((n) => `function/file${n}`),
  'arrow/alerts',
  'arrow/deep-identifier',
  'arrow/navigation'
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
      input: readFile('add-classname/input/arrow/no-jsx.js'),
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

  const input = readFile('add-classname/input/arrow/file21.js');
  const output = readFile('add-classname/output/arrow/file21-with-trailing-comma.js');
  it('with trailing comma', () => {
    settings.set({ 'trailing-commas': true });
    expect(refactoring.refactor(input)).toBe(output);
    settings.revert();
  });
});
