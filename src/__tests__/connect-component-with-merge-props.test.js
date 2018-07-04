const { readDirectoryFilenames, readFile } = require('./test-utils');
const ConnectComponentWithMergeProps = require('../refactorings/connect-component-with-merge-props');

const tests = readDirectoryFilenames('connect-component-with-merge-props/input')
  .map((filename) => ({
    name: filename,
    input: readFile(`connect-component-with-merge-props/input/${filename}`),
    output: readFile(`connect-component-with-merge-props/output/${filename}`)
  }));

describe('connect-component-with-merge-props:canApply', () => {
  const refactoring = new ConnectComponentWithMergeProps();
  tests.forEach((test) => {
    it(`canApply: ${test.name}`, () => {
      expect(refactoring.canApply(test.input)).toBeTruthy();
    });
  });
});

describe('connect-component-with-merge-props:refactor', () => {
  const refactoring = new ConnectComponentWithMergeProps();
  tests.forEach((test) => {
    it(`refactor: ${test.name}`, () => {
      expect(refactoring.refactor(test.input)).toBe(test.output);
    });
  });
});
