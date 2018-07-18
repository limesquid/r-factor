const { readDirectoryFilenames, readFile } = require('./test-utils');
const ToggleWithRouterHoc = require('../refactorings/toggle-with-router-hoc');

const tests = readDirectoryFilenames('toggle-with-router-hoc/input')
  .map((filename) => ({
    name: filename,
    input: readFile(`toggle-with-router-hoc/input/${filename}`),
    output: readFile(`toggle-with-router-hoc/output/${filename}`)
  }));

describe('toggle-with-router-hoc:canApply', () => {
  const refactoring = new ToggleWithRouterHoc();
  tests.forEach((test) => {
    it(`canApply: ${test.name}`, () => {
      expect(refactoring.canApply(test.input)).toBeTruthy();
    });
  });
});

describe('toggle-with-router-hoc:refactor', () => {
  const refactoring = new ToggleWithRouterHoc();
  tests.forEach((test) => {
    it(`refactor: ${test.name}`, () => {
      expect(refactoring.refactor(test.input)).toBe(test.output);
    });
  });
});
