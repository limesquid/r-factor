const { readTransformationsFile } = require('../test-utils');
const wrapComponent = require('../../transformations/wrap-component');
const settings = require('../../settings');

const readInputFile = (filename) => readTransformationsFile(`wrap-component/input/${filename}.js`);
const readOutputFile = (filename) => readTransformationsFile(`wrap-component/output/${filename}.js`);

describe('transformation:wrap-component', () => {

  beforeEach(() => {
    settings.revert();
  })

  it('should rename and wrap a component (without importing a module)', () => {
    settings.set({ 'default-component-name': 'MyComponent' });
    const input = readInputFile('button1');
    const output = readOutputFile('button1');
    const result = wrapComponent(input, undefined, { name: 'withRouter' });
    expect(result).toBe(output);
  });

  it('should wrap default export (without importing a module)', () => {
    const input = readInputFile('button2');
    const output = readOutputFile('button2');
    const result = wrapComponent(input, undefined, { name: 'withRouter' });
    expect(result).toBe(output);
  });

  it('should remove old and add new export statement with component wrapped', () => {
    const input = readInputFile('button3');
    const output = readOutputFile('button3');
    const result = wrapComponent(input, undefined, {
      name: 'withRouter',
      import: {
        module: 'react-router',
        subImports: { withRouter: 'withRouter' }
      }
    });
    expect(result).toBe(output);
  });

  it('should wrap already wrapped component (innermost)', () => {
    const input = readInputFile('button4');
    const output = readOutputFile('button4');
    const result = wrapComponent(input, undefined, {
      name: 'withAuth',
      import: {
        module: 'auth',
        subImports: { withAuth: 'withAuth' }
      }
    });
    expect(result).toBe(output);
  });

  it('should wrap already wrapped component with hoc invoked (innermost)', () => {
    const input = readInputFile('button5');
    const output = readOutputFile('button5');
    const result = wrapComponent(input, undefined, {
      name: 'connect',
      invoke: [],
      import: {
        module: 'react-redux',
        subImports: { connect: 'connect' }
      }
    });
    expect(result).toBe(output);
  });

  it('should wrap component with hoc invoked with arguments', () => {
    const input = readInputFile('button6');
    const output = readOutputFile('button6');
    const result = wrapComponent(input, undefined, {
      name: 'connect',
      invoke: [ 'mapStateToProps' ],
      import: {
        module: 'react-redux',
        subImports: { connect: 'connect' }
      }
    });
    expect(result).toBe(output);
  });

  it('should wrap component (outermost)', () => {
    const input = readInputFile('button7');
    const output = readOutputFile('button7');
    const result = wrapComponent(input, undefined, {
      name: 'withRouter',
      outermost: true,
      import: {
        module: 'react-router',
        subImports: { withRouter: 'withRouter' }
      }
    });
    expect(result).toBe(output);
  });

  it('should wrap component returned in hoc', () => {
    const input = readInputFile('button8');
    const output = readOutputFile('button8');
    const result = wrapComponent(input, undefined, {
      name: 'withRouter',
      import: {
        module: 'react-router',
        subImports: { withRouter: 'withRouter' }
      }
    });
    expect(result).toBe(output);
  });

  it('should wrap already wrapped component returned in hoc (outermost)', () => {
    const input = readInputFile('button9');
    const output = readOutputFile('button9');
    const result = wrapComponent(input, undefined, {
      name: 'withAuth',
      outermost: true,
      import: {
        module: 'auth',
        subImports: { withAuth: 'withAuth' }
      }
    });
    expect(result).toBe(output);
  });

  it('should add body to hoc and wrap inner component (default export)', () => {
    const input = readInputFile('button10');
    const output = readOutputFile('button10');
    const result = wrapComponent(input, undefined, {
      name: 'withRouter',
      import: {
        module: 'react-router',
        subImports: { withRouter: 'withRouter' }
      }
    });
    expect(result).toBe(output);
  });

  it('should add body to hoc and wrap inner component (named export)', () => {
    const input = readInputFile('button11');
    const output = readOutputFile('button11');
    const result = wrapComponent(input, undefined, {
      name: 'withRouter',
      import: {
        module: 'react-router',
        subImports: { withRouter: 'withRouter' }
      }
    });
    expect(result).toBe(output);
  });

  it('should name nameless class component (using setting) and wrap properly', () => {
    settings.set({ 'component-name-collision-pattern': 'Suffix${name}Prefix' });
    console.log(settings.componentNameCollisionPattern);
    const input = readInputFile('button12');
    const output = readOutputFile('button12');
    const result = wrapComponent(input, undefined, {
      name: 'withRouter',
      import: {
        module: 'react-router',
        subImports: { withRouter: 'withRouter' }
      }
    });
    expect(result).toBe(output);
  });

  it('should rename class (using setting) component wrap properly', () => {
    const input = readInputFile('button13');
    const output = readOutputFile('button13');
    const result = wrapComponent(input, undefined, {
      name: 'withRouter',
      import: {
        module: 'react-router',
        subImports: { withRouter: 'withRouter' }
      }
    });
    expect(result).toBe(output);
  });
});
