const fs = require('fs');
const path = require('path');
const { canRefactor, refactor } = require('..');

const refactoredButton = `class Button extends Component {
  render() {
    return (
      <div>Button</div>
    );
  }
}`;

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
        input: `const Button = () => (<div>Button</div>);`,
        output: refactoredButton
      },
      {
        input: fs.readFileSync(path.resolve(__dirname, './input/button.jsx'), 'utf-8'),
        output: fs.readFileSync(path.resolve(__dirname, './output/button.jsx'), 'utf-8')
      },
      {
        input: fs.readFileSync(path.resolve(__dirname, './input/button2.jsx'), 'utf-8'),
        output: fs.readFileSync(path.resolve(__dirname, './output/button2.jsx'), 'utf-8')
      }
    ];
    tests.forEach(({ input, output }) => expect(refactor(input)).toBe(output));
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
