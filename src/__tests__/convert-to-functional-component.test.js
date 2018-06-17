const { range, readFile } = require('./test-utils');
const ConvertToFunctionalComponent = require('../refactorings/convert-to-functional-component');

const files = range(1, 14).map((n) => `button${n}`);

describe('convert-to-functional-component:canApply', () => {
  const refactoring = new ConvertToFunctionalComponent();
  const tests = files.map((file) => ({
    name: `components/class/${file}.js`,
    input: readFile(`components/class/${file}.js`),
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
    name: `components/class/${file}.js -> functional/${file}.js`,
    input: readFile(`components/class/${file}.js`),
    output: readFile(`components/functional/${file}.js`)
  }));
  tests.forEach(({ name, input, output }) => {
    it(`refactor "${name}"`, () => {
      expect(refactoring.refactor(input)).toBe(output);
    });
  });
});
