const { readDirectoryFilenames, readFile } = require('./test-utils');
const ConnectComponentWithState = require('../refactorings/connect-component-with-state');

const tests = readDirectoryFilenames('connect-component-with-state/input')
  .map((filename) => ({
    name: filename,
    input: readFile(`connect-component-with-state/input/${filename}`),
    output: readFile(`connect-component-with-state/output/${filename}`)
  }));

describe('connect-component-with-state:canApply', () => {
  const refactoring = new ConnectComponentWithState();
  tests.forEach((test) => {
    it(`canApply: ${test.name}`, () => {
      expect(refactoring.canApply(test.input)).toBeTruthy();
    });
  });
});

describe('connect-component-with-state:refactor', () => {
  const refactoring = new ConnectComponentWithState();
  tests.forEach((test) => {
    it(`refactor: ${test.name}`, () => {
      expect(refactoring.refactor(test.input)).toBe(test.output);
    });
  });
});
