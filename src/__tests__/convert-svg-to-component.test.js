const { createFileDetails, readFile } = require('./test-utils');
const settings = require('../settings');
const ConvertSvgToComponent = require('../refactorings/convert-svg-to-component');

const files = [
  createFileDetails('file1'),
  createFileDetails('file2', { 'svg-component-type': 'class' }),
  createFileDetails('file3', { 'svg-component-type': 'function' }),
  createFileDetails('file4'),
  createFileDetails('file5'),
  createFileDetails('file6'),
  createFileDetails('file7'),
  createFileDetails('file8'),
  createFileDetails('invalid-xml')
];

const tests = files.map(({ file, additionalSettings }) => ({
  additionalSettings,
  name: file,
  input: readFile(`convert-svg-to-component/input/${file}.js`),
  output: readFile(`convert-svg-to-component/output/${file}.js`)
}));

describe('convert-svg-to-component:canApply', () => {
  const refactoring = new ConvertSvgToComponent();
  tests.forEach((test) => {
    it(`canApply: ${test.name}`, () => {
      expect(refactoring.canApply(test.input)).toBeTruthy();
    });
  });
});

describe('convert-svg-to-component:refactor', () => {
  const refactoring = new ConvertSvgToComponent();
  tests.forEach((test) => {
    it(`refactor: ${test.name}`, () => {
      settings.set(test.additionalSettings);
      const result = refactoring.refactor(test.input);
      settings.revert();
      expect(result).toBe(test.output);
    });
  });
});
