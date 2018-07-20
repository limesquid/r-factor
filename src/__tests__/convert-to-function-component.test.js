const { range, readFile } = require('./test-utils');
const ConvertToFunctionComponent = require('../refactorings/convert-to-function-component');

const types = [ 'class', 'arrow' ];
const files = [
  ...range(1, 14).map((n) => `button${n}`),
  'contact-us',
  'image-header'
];

describe('convert-to-function-component:refactor:react-imports', () => {
  const refactoring = new ConvertToFunctionComponent();
  const tests = [
    {
      input: 'import React, { Component } from \'react\';',
      output: 'import React from \'react\';'
    },
    {
      input: 'import React, { Children, Component } from \'react\';',
      output: 'import React, { Children } from \'react\';'
    },
    {
      input: 'import React, { Children as X, Component } from \'react\';',
      output: 'import React, { Children as X } from \'react\';'
    }
  ];
  tests.forEach(({ input, output }, index) => {
    it(`refactor "${index}"`, () => {
      expect(refactoring.refactor(input)).toBe(output);
    });
  });
});

types.forEach((type) => {
  describe(`convert-to-function-component:${type}:canApply`, () => {
    const refactoring = new ConvertToFunctionComponent();
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
  describe(`convert-to-function-component:${type}:refactor`, () => {
    const refactoring = new ConvertToFunctionComponent();
    const tests = files.map((file) => ({
      name: `${type}/${file}.js -> function/${file}.js`,
      input: readFile(`${type}/${file}.js`),
      output: readFile(`function/${file}.js`)
    }));
    tests.forEach(({ name, input, output }) => {
      it(`refactor "${name}"`, () => {
        expect(refactoring.refactor(input)).toBe(output);
      });
    });
  });
});
