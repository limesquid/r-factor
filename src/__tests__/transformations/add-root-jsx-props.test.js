const parser = require('../../utils/parser');
const { readTransformationsFile } = require('./../test-utils');
const addRootJsxProps = require('../../transformations/add-root-jsx-props');

const files = [
  'file1'
];

describe('add-root-jsx-props', () => {
  const tests = files.map((file) => ({
    name: `add-root-jsx-props/input/${file}.js -> add-root-jsx-props/output/${file}.js`,
    input: readTransformationsFile(`add-root-jsx-props/input/${file}.js`),
    output: readTransformationsFile(`add-root-jsx-props/output/${file}.js`)
  }));
  tests.forEach(({ name, input, output }) => {
    const ast = parser.parse(input);
    it(`transform "${name}"`, () => {
      expect(addRootJsxProps(input, ast, {
        d: '\'4\'',
        c: true,
        b: '"3"',
        a: 2
      })).toBe(output);
    });
  });
});
