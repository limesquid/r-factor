const { readFile } = require('./test-utils');
const MoveDefaultPropsOutOfClass = require('../move-default-props-out-of-class');

describe('move-default-props-out-of-class', () => {
  const refactoring = new MoveDefaultPropsOutOfClass();

  it('applies Button refactoring correctly', () => {
    const tests = [
      {
        input: readFile('default-props/inside/button1.js'),
        output: readFile('default-props/outside/button1.js')
      },
      {
        input: readFile('default-props/inside/button2.js'),
        output: readFile('default-props/outside/button2.js')
      }
    ];
    tests.forEach(({ input, output }) => expect(refactoring.refactor(input)).toBe(output));
  });
});
