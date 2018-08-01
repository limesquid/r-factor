const { range, readFile } = require('./test-utils');
const SortImports = require('../refactorings/sort-imports');
const settings = require('../settings');

const alphabeticFiles = range(1, 2).map((n) => `alphabetic${n}`);
const customFiles = range(1, 5).map((n) => `custom${n}`);
const allFiles = [
  ...customFiles,
  ...alphabeticFiles
];

describe('sort-imports:canApply', () => {
  const refactoring = new SortImports();
  const tests = allFiles.map((file) => ({
    name: `sort-imports/input/${file}.js`,
    input: readFile(`sort-imports/input/${file}.js`),
    output: true
  }));
  tests.forEach(({ name, input, output }) => {
    it(`canApply "${name}"`, () => {
      settings.set({
        'modules-order': [ 'react', 'prop-types', 'classnames' ]
      });
      const result = refactoring.canApply(input);
      settings.revert();
      expect(result).toBe(output);
    });
  });
});

describe('sort-imports:refactor:custom', () => {
  const refactoring = new SortImports();
  const tests = customFiles.map((file) => ({
    name: `sort-imports/input/${file}.js -> sort-imports/output/${file}.js`,
    input: readFile(`sort-imports/input/${file}.js`),
    output: readFile(`sort-imports/output/${file}.js`)
  }));
  tests.forEach(({ name, input, output }) => {
    it(`refactor "${name}"`, () => {
      settings.set({
        'modules-order': [ 'react', 'prop-types', 'classnames' ]
      });
      const result = refactoring.refactor(input);
      settings.revert();
      expect(result).toBe(output);
    });
  });
});

describe('sort-imports:refactor:alphabetic', () => {
  const refactoring = new SortImports();
  const tests = alphabeticFiles.map((file) => ({
    name: `sort-imports/input/${file}.js -> sort-imports/output/${file}.js`,
    input: readFile(`sort-imports/input/${file}.js`),
    output: readFile(`sort-imports/output/${file}.js`)
  }));
  tests.forEach(({ name, input, output }) => {
    it(`refactor "${name}"`, () => {
      settings.set({
        'modules-order': 'alphabetic'
      });
      const result = refactoring.refactor(input);
      settings.revert();
      expect(result).toBe(output);
    });
  });
});
