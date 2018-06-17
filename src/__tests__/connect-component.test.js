const { readDirectoryFilenames, readFile } = require('./test-utils');

const tests = readDirectoryFilenames('connect-component/input')
  .map((filename) => ({
    name: filename,
    input: readFile(`connect-component/input/${filename}`),
    output: readFile(`connect-component/output/${filename}`)
  }))

describe('connect-component:canApply', () => {
  tests.forEach((test) => {
    it(`canApply: ${test.name}`, () => {
      expect(1).toBe(1);
    });
  });
});

describe('connect-component:refactor', () => {
  tests.forEach((test) => {
    it(`refactor: ${test.name}`, () => {
      expect(1).toBe(1);
    });
  });
});
