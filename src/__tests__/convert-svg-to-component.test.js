const { readDirectoryFilenames, readFile } = require('./test-utils');
const ConvertSvgToComponent = require('../refactorings/convert-svg-to-component');

const tests = readDirectoryFilenames('convert-svg-to-component/input')
  .map((filename) => ({
    name: filename,
    input: readFile(`convert-svg-to-component/input/${filename}`),
    output: readFile(`convert-svg-to-component/output/${filename}`)
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
      expect(refactoring.refactor(test.input)).toBe(test.output);
    });
  });
});
