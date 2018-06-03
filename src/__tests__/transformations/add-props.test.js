const babylon = require('@babel/parser');
const { readTransformationsFile } = require('./../test-utils');
const { babylonOptions } = require('../../options');
const addProps = require('../../transformations/add-props');

const files = [ 1, 2, 3, 4 ].map((n) => `file${n}`);

describe('add-prop', () => {
  const tests = files.map((file) => ({
    name: `add-prop/input/${file}.js -> add-prop/output/${file}.js`,
    input: readTransformationsFile(`add-prop/input/${file}.js`),
    output: readTransformationsFile(`add-prop/output/${file}.js`)
  }));
  tests.forEach(({ name, input, output }) => {
    const ast = babylon.parse(input, babylonOptions);
    it(`transform "${name}"`, () => {
      expect(addProps(input, ast, {
        f: 'PropTypes.func.isRequired'
      })).toBe(output);
    });
  });
});
