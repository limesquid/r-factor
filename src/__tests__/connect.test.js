const { readDirectoryFilenames, readFile } = require('./test-utils');
const Connect = require('../refactorings/connect');

const tests = readDirectoryFilenames('connect/input')
  .map((filename) => ({
    name: filename,
    input: readFile(`connect/input/${filename}`),
    output: readFile(`connect/output/${filename}`)
  }));

describe('connect:canApply', () => {
  const refactoring = new Connect();
  tests.forEach((test) => {
    it(`canApply: ${test.name}`, () => {
      expect(refactoring.canApply(test.input)).toBeTruthy();
    });
  });
});

describe('connect:refactor', () => {
  const refactoring = new Connect();
  tests.forEach((test) => {
    it(`refactor: ${test.name}`, () => {
      expect(refactoring.refactor(test.input)).toBe(test.output);
    });
  });
});
