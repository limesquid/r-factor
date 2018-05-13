const { readFile } = require('./utils');
const ConvertToFunctionalComponent = require('../convert-to-functional-component');

describe('convert-to-functional-component', () => {
  const refactoring = new ConvertToFunctionalComponent();

  it('knows if should refactor Button', () => {
    const tests = [
      {
        input: readFile('functional/button1.jsx'),
        output: false
      },
      {
        input: readFile('functional/button2.jsx'),
        output: true
      },
      {
        input: readFile('functional/button3.jsx'),
        output: true
      },
    ];
    tests.forEach(({ input, output }) => expect(refactoring.canApply(input)).toBe(output));
  });

  it('replaces React import', () => {
    const tests = [
      {
        input: `import React from 'react';`,
        output: `import React, { Component } from 'react';`,
      },
      {
        input: `import React, { Children } from 'react';`,
        output: `import React, { Children, Component } from 'react';`,
      },
      {
        input: `import React, { Children as X } from 'react';`,
        output: `import React, { Children as X, Component } from 'react';`,
      }
    ];
    tests.forEach(({ input, output }) => expect(refactoring.refactor(input)).toBe(output));
  });

  it('applies Button refactoring correctly', () => {
    const tests = [
      {
        input: readFile('functional/button1.jsx'),
        output: readFile('non-functional/button1.jsx')
      },
      {
        input: readFile('functional/button2.jsx'),
        output: readFile('non-functional/button2.jsx')
      },
      {
        input: readFile('functional/button3.jsx'),
        output: readFile('non-functional/button3.jsx')
      },
    ];
    tests.forEach(({ input, output }) => expect(refactoring.refactor(input)).toBe(output));
  });
});
