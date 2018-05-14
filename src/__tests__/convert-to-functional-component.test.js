const { readFile } = require('./test-utils');
const ConvertToFunctionalComponent = require('../convert-to-functional-component');

describe('convert-to-functional-component', () => {
  const refactoring = new ConvertToFunctionalComponent();

  it('knows if should refactor Button', () => {
    const tests = [
      {
        input: readFile('non-functional/button1.js'),
        output: true
      },
      {
        input: readFile('non-functional/button2.js'),
        output: true
      },
      {
        input: readFile('non-functional/button3.js'),
        output: true
      },
      {
        input: readFile('non-functional/button4.js'),
        output: true
      }
    ];
    tests.forEach(({ input, output }) => expect(refactoring.canApply(input)).toBe(output));
  });

  it('replaces React import', () => {
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
    tests.forEach(({ input, output }) => expect(refactoring.refactor(input)).toBe(output));
  });

  it('applies Button refactoring correctly', () => {
    const tests = [
      {
        input: readFile('non-functional/button1.js'),
        output: readFile('functional/button1.js')
      },
      {
        input: readFile('non-functional/button2.js'),
        output: readFile('functional/button2.js')
      },
      {
        input: readFile('non-functional/button3.js'),
        output: readFile('functional/button3.js')
      },
      {
        input: readFile('non-functional/button4.js'),
        output: readFile('functional/button4.js')
      }
    ];
    tests.forEach(({ input, output }) => expect(refactoring.refactor(input)).toBe(output));
  });
});
