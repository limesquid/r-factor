const { readFile } = require('./test-utils');
const MovePropTypesToClass = require('../move-prop-types-to-class');

describe('move-prop-types-to-class', () => {
  const refactoring = new MovePropTypesToClass();

  it('applies Button refactoring correctly', () => {
    const tests = [
      {
        input: readFile('prop-types/outside/button1.js'),
        output: readFile('prop-types/inside/button1.js')
      },
      {
        input: readFile('prop-types/outside/button2.js'),
        output: readFile('prop-types/inside/button2.js')
      }
    ];
    tests.forEach(({ input, output }) => expect(refactoring.refactor(input)).toBe(output));
  });
});
