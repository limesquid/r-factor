const fs = require('fs');
const path = require('path');
const { canRefactor, refactor } = require('..');

describe('Solver', () => {
  it('knows if should refactor Button', () => {
    // expect(canRefactor(buttonCode)).toBe(true);
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
    tests.forEach(({ input, output }) => expect(refactor(input)).toBe(output));
  });

  it('applies Button refactoring correctly', () => {
    const tests = [
      {
        input: fs.readFileSync(path.resolve(__dirname, './input/button1.jsx'), 'utf-8'),
        output: fs.readFileSync(path.resolve(__dirname, './output/button1.jsx'), 'utf-8')
      },
      {
        input: fs.readFileSync(path.resolve(__dirname, './input/button2.jsx'), 'utf-8'),
        output: fs.readFileSync(path.resolve(__dirname, './output/button2.jsx'), 'utf-8')
      },
      {
        input: fs.readFileSync(path.resolve(__dirname, './input/button3.jsx'), 'utf-8'),
        output: fs.readFileSync(path.resolve(__dirname, './output/button3.jsx'), 'utf-8')
      },
    ];
    tests.forEach(({ input, output }) => expect(refactor(input)).toBe(output));
  });
});
