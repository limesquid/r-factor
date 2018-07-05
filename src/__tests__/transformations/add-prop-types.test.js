const parser = require('../../utils/parser');
const { readTransformationsFile } = require('./../test-utils');
const addPropTypes = require('../../transformations/add-prop-types');

const files = [ 1, 2, 3, 4, 5 ].map((n) => `file${n}`);

describe('add-prop-types', () => {
  const tests = files.map((file) => ({
    name: `add-prop-types/input/${file}.js -> add-prop-types/output/${file}.js`,
    input: readTransformationsFile(`add-prop-types/input/${file}.js`),
    output: readTransformationsFile(`add-prop-types/output/${file}.js`)
  }));
  tests.forEach(({ name, input, output }) => {
    const ast = parser.parse(input);
    it(`transform "${name}"`, () => {
      expect(addPropTypes(input, ast, {
        f: 'PropTypes.func.isRequired'
      })).toBe(output);
    });
  });
});
