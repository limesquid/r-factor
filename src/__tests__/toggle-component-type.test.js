const { range, readFile } = require('./test-utils');
const ToggleComponentType = require('../refactorings/toggle-component-type');
const settings = require('../settings');

const types = [ 'arrow', 'class', 'function' ];
const functionalComponentTypes = [ 'arrow', 'function' ];
const files = [
  ...[ ...range(1, 6), ...range(10, 13) ].map((n) => `button${n}`),
  'contact-us'
];

types.forEach((type) => {
  describe(`toggle-component-type:${type}:canApply`, () => {
    const refactoring = new ToggleComponentType();
    const tests = files.map((file) => ({
      name: `${type}/${file}.js`,
      input: readFile(`${type}/${file}.js`),
      output: true
    }));
    if (type === 'class') {
      tests.push({
        name: 'non component class',
        input: 'class X {}',
        output: false
      });
    }
    tests.forEach(({ name, input, output }) => {
      it(`canApply "${name}"`, () => {
        expect(refactoring.canApply(input)).toBe(output);
      });
    });
  });
});

functionalComponentTypes.forEach((type) => {
  describe('toggle-component-type:to-class:refactor', () => {
    const refactoring = new ToggleComponentType();
    const tests = files.map((file) => ({
      name: `${type}/${file}.js -> class/${file}.js`,
      input: readFile(`${type}/${file}.js`),
      output: readFile(`class/${file}.js`)
    }));
    tests.forEach(({ name, input, output }) => {
      it(`refactor "${name}"`, () => {
        expect(refactoring.refactor(input)).toBe(output);
      });
    });
  });
});

functionalComponentTypes.forEach((type) => {
  describe(`toggle-component-type:to-${type}:refactor`, () => {
    const refactoring = new ToggleComponentType();
    const tests = files.map((file) => ({
      name: `class/${file}.js -> ${type}/${file}.js`,
      input: readFile(`class/${file}.js`),
      output: readFile(`${type}/${file}.js`)
    }));
    tests.forEach(({ name, input, output }) => {
      it(`refactor "${name}"`, () => {
        settings.set({
          'functional-component-type': type
        });
        const result = refactoring.refactor(input);
        settings.revert();
        expect(result).toBe(output);
      });
    });
  });
});
