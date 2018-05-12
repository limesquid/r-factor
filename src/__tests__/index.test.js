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
    const buttonCode = fs.readFileSync(path.resolve(__dirname, './input/button.jsx'), 'utf-8');
    const expectedButtonCode = fs.readFileSync(path.resolve(__dirname, './output/button.jsx'), 'utf-8');
    expect(refactor(buttonCode)).toBe(expectedButtonCode);
  });
});


/*
To Component
1.
import React, { Component } from 'react';

2.
class Button extends Component {
  render() {
    const { ... } = this.props;

    return (
      <jsx>
    );
  }
}

3. proptypes
*/
