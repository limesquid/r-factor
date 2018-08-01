const parser = require('../../utils/parser');
const { readTransformationsFile } = require('./../test-utils');
const addPropTypes = require('../../transformations/add-prop-types');
const settings = require('../../settings');

const files = [ 1, 2, 3, 4, 5, 6 ].map((n) => `file${n}`);

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

  it('transform with trailing comma', () => {
    settings.set({ 'trailing-commas': true });
    const input = readTransformationsFile('add-prop-types/input/with-trailing-comma.js');
    const output = readTransformationsFile('add-prop-types/output/with-trailing-comma.js');
    const ast = parser.parse(input);
    expect(addPropTypes(input, ast, {
      f: 'PropTypes.func.isRequired'
    })).toBe(output);
    settings.revert();
  });
});
