const { readDirectoryFilenames, readFile } = require('./test-utils');
const ConnectComponentWithDispatch = require('../refactorings/connect-component-with-dispatch');

const tests = readDirectoryFilenames('connect-component-with-dispatch/input')
  .map((filename) => ({
    name: filename,
    input: readFile(`connect-component-with-dispatch/input/${filename}`),
    output: readFile(`connect-component-with-dispatch/output/${filename}`)
  }));

describe('connect-component-with-dispatch:canApply', () => {
  const refactoring = new ConnectComponentWithDispatch();
  tests.forEach((test) => {
    it(`canApply: ${test.name}`, () => {
      expect(refactoring.canApply(test.input)).toBeTruthy();
    });
  });
});

describe('connect-component-with-dispatch:refactor', () => {
  const refactoring = new ConnectComponentWithDispatch();
  tests.forEach((test) => {
    it(`refactor: ${test.name}`, () => {
      expect(refactoring.refactor(test.input)).toBe(test.output);
    });
  });
});
