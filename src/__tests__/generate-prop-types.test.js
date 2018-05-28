const { readFile } = require('./test-utils');
const GeneratePropTypes = require('../generate-prop-types');

describe('generate-prop-types', () => {
  const refactoring = new GeneratePropTypes();

  it('applies Button refactoring correctly', () => {
    const tests = [
      {
        input: readFile('generate-prop-types/inside/button1.js'),
        output: readFile('generate-prop-types/outside/button1.js')
      },
      {
        input: readFile('generate-prop-types/inside/button2.js'),
        output: readFile('generate-prop-types/outside/button2.js')
      },
      {
        input: readFile('generate-prop-types/inside/button3.js'),
        output: readFile('generate-prop-types/outside/button3.js')
      },
      {
        input: readFile('generate-prop-types/inside/button4.js'),
        output: readFile('generate-prop-types/outside/button4.js')
      },
      {
        input: readFile('generate-prop-types/inside/button5.js'),
        output: readFile('generate-prop-types/outside/button5.js')
      }
    ];
    tests.forEach(({ input, output }) => expect(refactoring.refactor(input)).toBe(output));
  });
});
