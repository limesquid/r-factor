const parser = require('../../utils/parser');
const { readTransformationsFile } = require('./../test-utils');
const addPropsUsage = require('../../transformations/add-props-usage');

const files = [
  'no-jsx'
];

describe('add-props-usage', () => {
  const tests = files.map((file) => ({
    name: `add-props-usage/input/${file}.js -> add-props-usage/output/${file}.js`,
    input: readTransformationsFile(`add-props-usage/input/${file}.js`),
    output: readTransformationsFile(`add-props-usage/output/${file}.js`)
  }));
  tests.forEach(({ name, input, output }) => {
    const ast = parser.parse(input);
    it(`transform "${name}"`, () => {
      expect(addPropsUsage(input, ast, [ 'className' ])).toBe(output);
    });
  });
});
