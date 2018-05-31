const { readFile } = require('./test-utils');
const ConvertToFunctionalComponent = require('../refactorings/convert-to-functional-component');

const files = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ].map((n) => `button${n}`);

describe('convert-to-functional-component:canApply', () => {
  const refactoring = new ConvertToFunctionalComponent();
  const tests = files.map((file) => ({
    name: `non-functional/${file}.js`,
    input: readFile(`non-functional/${file}.js`),
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

describe('convert-to-functional-component:refactor:react-imports', () => {
  const refactoring = new ConvertToFunctionalComponent();
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

describe('convert-to-functional-component:refactor', () => {
  const refactoring = new ConvertToFunctionalComponent();
  const tests = files.map((file) => ({
    name: `non-functional/${file}.js -> functional/${file}.js`,
    input: readFile(`non-functional/${file}.js`),
    output: readFile(`functional/${file}.js`)
  }));
  tests.forEach(({ name, input, output }) => {
    it(`refactor "${name}"`, () => {
      expect(refactoring.refactor(input)).toBe(output);
    });
  });
});
