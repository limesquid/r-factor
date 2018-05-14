const { readFile } = require('./test-utils');
const MovePropTypesOutOfClass = require('../move-prop-types-out-of-class');

describe('move-prop-types-out-of-class', () => {
  const refactoring = new MovePropTypesOutOfClass();

  it('applies Button refactoring correctly', () => {
    // const tests = [
    //   {
    //     input: readFile('prop-types/inside/button1.js'),
    //     output: readFile('prop-types/outside/button1.js')
    //   },
    //   {
    //     input: readFile('prop-types/inside/button2.js'),
    //     output: readFile('prop-types/outside/button2.js')
    //   }
    // ];
    // tests.forEach(({ input, output }) => expect(refactoring.refactor(input)).toBe(output));
  });
});
