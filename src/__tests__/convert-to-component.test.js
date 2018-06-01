const { range, readFile } = require('./test-utils');
const ConvertToComponent = require('../refactorings/convert-to-component');

const files = [ ...range(1, 6), ...range(10, 13) ].map((n) => `button${n}`);

describe('convert-to-component:canApply', () => {
  const refactoring = new ConvertToComponent();
  const tests = files.map((file) => ({
    name: `functional/${file}.js`,
    input: readFile(`functional/${file}.js`),
    output: true
  }));
  tests.forEach(({ name, input, output }) => {
    it(`canApply "${name}"`, () => {
      expect(refactoring.canApply(input)).toBe(output);
    });
  });
});

describe('convert-to-component:refactor:react-imports', () => {
  const refactoring = new ConvertToComponent();
  const tests = [
    {
      input: 'import React from \'react\';',
      output: 'import React, { Component } from \'react\';'
    },
    {
      input: 'import React, { Children } from \'react\';',
      output: 'import React, { Children, Component } from \'react\';'
    },
    {
      input: 'import React, { Children as X } from \'react\';',
      output: 'import React, { Children as X, Component } from \'react\';'
    }
  ];
  tests.forEach(({ input, output }, index) => {
    it(`refactor "${index}"`, () => {
      expect(refactoring.refactor(input)).toBe(output);
    });
  });
});

describe('convert-to-component:refactor', () => {
  const refactoring = new ConvertToComponent();
  const tests = files.map((file) => ({
    name: `functional/${file}.js -> non-functional/${file}.js`,
    input: readFile(`functional/${file}.js`),
    output: readFile(`non-functional/${file}.js`)
  }));
  tests.forEach(({ name, input, output }) => {
    it(`refactor "${name}"`, () => {
      expect(refactoring.refactor(input)).toBe(output);
    });
  });
});
