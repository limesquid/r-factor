const { readFile } = require('./test-utils');
const GeneratePropTypes = require('../refactorings/generate-prop-types');

const files = [ 1/*, 2, 3, 4, 5, 6, 7, 8*/ ].map((n) => `button${n}`).concat(
  [ 1/*, 2*/ ].map((n) => `filter${n}`)
);

describe('generate-prop-types:canApply', () => {
  const refactoring = new GeneratePropTypes();
  const tests = files.map((file) => ({
    name: `generate-prop-types/input/${file}.js`,
    input: readFile(`generate-prop-types/input/${file}.js`),
    output: true
  }));
  tests.forEach(({ name, input, output }) => {
    it(`canApply "${name}"`, () => {
      expect(refactoring.canApply(input)).toBe(output);
    });
  });
});

describe('generate-prop-types:refactor', () => {
  const refactoring = new GeneratePropTypes();
  const tests = files.map((file) => ({
    name: `generate-prop-types/input/${file}.js -> generate-prop-types/output/${file}.js`,
    input: readFile(`generate-prop-types/input/${file}.js`),
    output: readFile(`generate-prop-types/output/${file}.js`)
  }));
  tests.forEach(({ name, input, output }) => {
    it(`refactor "${name}"`, () => {
      expect(refactoring.refactor(input)).toBe(output);
    });
  });
});
