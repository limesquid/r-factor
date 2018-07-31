const { createFileDetails, range, readFile } = require('./test-utils');
const settings = require('../settings');
const GeneratePropTypes = require('../refactorings/generate-prop-types');

const files = [
  ...range(1, 10).map((n) => createFileDetails(`button${n}`)),
  ...range(1, 1).map((n) => createFileDetails(`filter${n}`)),
  ...range(1, 2).map((n) => createFileDetails(`header${n}`)),
  ...range(1, 1).map((n) => createFileDetails(`hoc${n}`, { indent: 4 }))
];

describe('generate-prop-types:canApply', () => {
  const refactoring = new GeneratePropTypes();
  const tests = files.map(({ file }) => ({
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
  const tests = files.map(({ file, additionalSettings }) => ({
    additionalSettings,
    name: `generate-prop-types/input/${file}.js -> generate-prop-types/output/${file}.js`,
    input: readFile(`generate-prop-types/input/${file}.js`),
    output: readFile(`generate-prop-types/output/${file}.js`)
  }));
  tests.forEach(({ additionalSettings, name, input, output }) => {
    it(`refactor "${name}"`, () => {
      settings.set(additionalSettings);
      expect(refactoring.refactor(input)).toBe(output);
      settings.revert();
    });
  });
});
