const { readDirectoryFilenames, readFile } = require('./test-utils');
const ConnectMapDispatchToProps = require('../refactorings/connect-map-dispatch-to-props');

const tests = readDirectoryFilenames('connect-map-dispatch-to-props/input')
  .map((filename) => ({
    name: filename,
    input: readFile(`connect-map-dispatch-to-props/input/${filename}`),
    output: readFile(`connect-map-dispatch-to-props/output/${filename}`)
  }));

describe('connect-map-dispatch-to-props:canApply', () => {
  const refactoring = new ConnectMapDispatchToProps();
  tests.forEach((test) => {
    it(`canApply: ${test.name}`, () => {
      expect(refactoring.canApply(test.input)).toBeTruthy();
    });
  });
});

describe('connect-map-dispatch-to-props:refactor', () => {
  const refactoring = new ConnectMapDispatchToProps();
  tests.forEach((test) => {
    it(`refactor: ${test.name}`, () => {
      expect(refactoring.refactor(test.input)).toBe(test.output);
    });
  });
});
