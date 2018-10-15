const parser = require('../../utils/parser');
const { readTransformationsFile } = require('./../test-utils');
const nameComponentIfUnnamed = require('../../transformations/name-component-if-unnamed');

const files = [
  'button1'
];

describe('name-component-if-unnamed', () => {
  const tests = files.map((file) => ({
    name: `name-component-if-unnamed/input/${file}.js -> name-component-if-unnamed/output/${file}.js`,
    input: readTransformationsFile(`name-component-if-unnamed/input/${file}.js`),
    output: readTransformationsFile(`name-component-if-unnamed/output/${file}.js`)
  }));
  tests.forEach(({ name, input, output }) => {
    const ast = parser.parse(input);
    it(`transform "${name}"`, () => {
      expect(nameComponentIfUnnamed(input, ast)).toBe(output);
    });
  });
});
