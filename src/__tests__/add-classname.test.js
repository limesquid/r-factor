const { range, readFile } = require('./test-utils');
const AddClassname = require('../refactorings/add-classname');

const files = range(1, 4/*17*/).map((n) => `file${n}`);
const types = [
  'functional',
  'non-functional'
];

types.forEach((type) => {
  describe('add-classname:canApply', () => {
    const refactoring = new AddClassname();
    const tests = files.map((file) => ({
      name: `add-classname/${type}/input/${file}.js`,
      input: readFile(`add-classname/${type}/input/${file}.js`),
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
      name: `add-classname/${type}/input/${file}.js -> add-classname/${type}/output/${file}.js`,
      input: readFile(`add-classname/${type}/input/${file}.js`),
      output: readFile(`add-classname/${type}/output/${file}.js`)
    }));
    tests.forEach(({ name, input, output }) => {
      it(`refactor "${name}"`, () => {
        expect(refactoring.refactor(input)).toBe(output);
      });
    });
  });
});
