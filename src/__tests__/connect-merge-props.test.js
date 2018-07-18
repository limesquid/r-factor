const { readDirectoryFilenames, readFile } = require('./test-utils');
const ConnectMergeProps = require('../refactorings/connect-merge-props');

const tests = readDirectoryFilenames('connect-merge-props/input')
  .map((filename) => ({
    name: filename,
    input: readFile(`connect-merge-props/input/${filename}`),
    output: readFile(`connect-merge-props/output/${filename}`)
  }));

describe('connect-merge-props:canApply', () => {
  const refactoring = new ConnectMergeProps();
  tests.forEach((test) => {
    it(`canApply: ${test.name}`, () => {
      expect(refactoring.canApply(test.input)).toBeTruthy();
    });
  });
});

describe('connect-merge-props:refactor', () => {
  const refactoring = new ConnectMergeProps();
  tests.forEach((test) => {
    it(`refactor: ${test.name}`, () => {
      expect(refactoring.refactor(test.input)).toBe(test.output);
    });
  });
});
