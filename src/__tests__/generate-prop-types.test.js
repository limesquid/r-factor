const { readFile } = require('./test-utils');
const GeneratePropTypes = require('../generate-prop-types');

describe('generate-prop-types', () => {
  const refactoring = new GeneratePropTypes();

  it('applies refactoring correctly', () => {
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
      },
      {
        input: readFile('generate-prop-types/input/button7.js'),
        output: readFile('generate-prop-types/output/button7.js')
      },
      {
        input: readFile('generate-prop-types/input/button8.js'),
        output: readFile('generate-prop-types/output/button8.js')
      },
      {
        input: readFile('generate-prop-types/input/filter1.js'),
        output: readFile('generate-prop-types/output/filter1.js')
      },
      {
        input: readFile('generate-prop-types/input/filter2.js'),
        output: readFile('generate-prop-types/output/filter2.js')
      }
    ];
    tests.forEach(({ input, output }) => expect(refactoring.refactor(input)).toBe(output));
  });
});
