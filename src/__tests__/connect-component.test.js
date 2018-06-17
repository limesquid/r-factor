const { readDirectoryFilenames, readFile } = require('./test-utils');
const ConnectComponent = require('../refactorings/connect-component');

const tests = readDirectoryFilenames('connect-component/input')
  .map((filename) => ({
    name: filename,
    input: readFile(`connect-component/input/${filename}`),
    output: readFile(`connect-component/output/${filename}`)
  }))

describe('connect-component:canApply', () => {
  const refactoring = new ConnectComponent();
  tests.forEach((test) => {
    it(`canApply: ${test.name}`, () => {
      expect(refactoring.canApply(test.input)).toBeTruthy();
    });
  });
});

describe('connect-component:refactor', () => {
  const refactoring = new ConnectComponent();
  tests.forEach((test) => {
    it(`refactor: ${test.name}`, () => {
      expect(refactoring.refactor(test.input)).toBe(test.output);
    });
  });
});
