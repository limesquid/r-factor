const { range, readFile } = require('./test-utils');
const ConvertToFunctionalFunctionComponent = require('../refactorings/convert-to-functional-function-component');

const types = [ 'class', 'functional-arrow' ];
const files = range(1, 14).map((n) => `button${n}`);

describe('convert-to-functional-function-component:canApply', () => {
  const refactoring = new ConvertToFunctionalFunctionComponent();
  const tests = files.map((file) => ({
    name: `class/${file}.js`,
    input: readFile(`class/${file}.js`),
    output: true
  }));
  tests.push({
    name: 'non component class',
    input: 'class X {}',
    output: false
  });
  tests.forEach(({ name, input, output }) => {
    it(`canApply "${name}"`, () => {
      expect(refactoring.canApply(input)).toBe(output);
    });
  });
});

describe('convert-to-functional-function-component:refactor:react-imports', () => {
  const refactoring = new ConvertToFunctionalFunctionComponent();
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
  describe(`convert-to-functional-function-component:${type}:refactor`, () => {
    const refactoring = new ConvertToFunctionalFunctionComponent();
    const tests = files.map((file) => ({
      name: `${type}/${file}.js -> functional-function/${file}.js`,
      input: readFile(`${type}/${file}.js`),
      output: readFile(`functional-function/${file}.js`)
    }));
    tests.forEach(({ name, input, output }) => {
      it(`refactor "${name}"`, () => {
        expect(refactoring.refactor(input)).toBe(output);
      });
    });
  });
});
