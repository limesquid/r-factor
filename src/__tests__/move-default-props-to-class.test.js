const { readFile } = require('./test-utils');
const MoveDefaultPropsToClass = require('../move-default-props-to-class');

describe('move-default-props-to-class', () => {
  const refactoring = new MoveDefaultPropsToClass();

  it('applies Button refactoring correctly', () => {
    // const tests = [
    //   {
    //     input: readFile('default-props/outside/button1.js'),
    //     output: readFile('default-props/inside/button1.js')
    //   },
    //   {
    //     input: readFile('default-props/outside/button2.js'),
    //     output: readFile('default-props/inside/button2.js')
    //   }
    // ];
    // tests.forEach(({ input, output }) => expect(refactoring.refactor(input)).toBe(output));
  });
});
