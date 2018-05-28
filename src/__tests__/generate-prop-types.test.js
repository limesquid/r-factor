const { readFile } = require('./test-utils');
const GeneratePropTypes = require('../generate-prop-types');

describe('generate-prop-types', () => {
  const refactoring = new GeneratePropTypes();

  it('applies Button refactoring correctly', () => {
    const tests = [
      {
        input: readFile('generate-prop-types/input/button1.js'),
        output: readFile('generate-prop-types/output/button1.js')
      },
      {
        input: readFile('generate-prop-types/input/button2.js'),
        output: readFile('generate-prop-types/output/button2.js')
      },
      {
        input: readFile('generate-prop-types/input/button3.js'),
        output: readFile('generate-prop-types/output/button3.js')
      },
      {
        input: readFile('generate-prop-types/input/button4.js'),
        output: readFile('generate-prop-types/output/button4.js')
      },
      {
        input: readFile('generate-prop-types/input/button5.js'),
        output: readFile('generate-prop-types/output/button5.js')
      },
      {
        input: readFile('generate-prop-types/input/button6.js'),
        output: readFile('generate-prop-types/output/button6.js')
      }
    ];
    tests.forEach(({ input, output }) => expect(refactoring.refactor(input)).toBe(output));
  });
});
