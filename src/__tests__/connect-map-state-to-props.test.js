const { readDirectoryFilenames, readFile } = require('./test-utils');
const ConnectMapStateToProps = require('../refactorings/connect-map-state-to-props');

const tests = readDirectoryFilenames('connect-map-state-to-props/input')
  .map((filename) => ({
    name: filename,
    input: readFile(`connect-map-state-to-props/input/${filename}`),
    output: readFile(`connect-map-state-to-props/output/${filename}`)
  }));

describe('connect-map-state-to-props:canApply', () => {
  const refactoring = new ConnectMapStateToProps();
  tests.forEach((test) => {
    it(`canApply: ${test.name}`, () => {
      expect(refactoring.canApply(test.input)).toBeTruthy();
    });
  });
});

describe('connect-map-state-to-props:refactor', () => {
  const refactoring = new ConnectMapStateToProps();
  tests.forEach((test) => {
    it(`refactor: ${test.name}`, () => {
      expect(refactoring.refactor(test.input)).toBe(test.output);
    });
  });
});
