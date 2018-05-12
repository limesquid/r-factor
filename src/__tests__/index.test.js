const fs = require('fs');
const path = require('path');
const { canRefactor, refactor } = require('..');

const buttonCode = fs.readFileSync(path.resolve(__dirname, './input/button.jsx'), 'utf-8');
const expectedButtonCode = fs.readFileSync(path.resolve(__dirname, './output/button.jsx'), 'utf-8');

describe('Solver', () => {
  it('knows if should refactor Button', () => {
    // expect(canRefactor(buttonCode)).toBe(true);
  });

  it('replaces React import', () => {
    expect(refactor(`import React from 'react';`)).toBe(`import React, { Component } from 'react';`);
    expect(refactor(`import React, { Children } from 'react';`)).toBe(`import React, { Children, Component } from 'react';`);
    expect(refactor(`import React, { Children as X } from 'react';`)).toBe(`import React, { Children as X, Component } from 'react';`);
  });

  it('applies Button refactoring correctly', () => {
    //expect(refactor(buttonCode)).toBe(expectedButtonCode);
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
