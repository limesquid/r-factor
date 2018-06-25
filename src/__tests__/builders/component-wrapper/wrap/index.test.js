const { readBuilderFile } = require('../../../test-utils');
const ComponentWrapper = require('../../../../builders/component-wrapper');

const readInputFile = (filename) => readBuilderFile(`component-wrapper/wrap/input/${filename}.js`);
const readOutputFile = (filename) => readBuilderFile(`component-wrapper/wrap/output/${filename}.js`);

describe('ComponentHoCBuilder:wrap', () => {
  it('should rename and wrap a component (without importing a module)', () => {
    const input = readInputFile('button1');
    const output = readOutputFile('button1');
    const componentWrapper = new ComponentWrapper(input);
    const result = componentWrapper
      .wrap({ name: 'withRouter' })
      .build();
    expect(result).toBe(output);
  });

  it('should wrap default export (without importing a module)', () => {
    const input = readInputFile('button2');
    const output = readOutputFile('button2');
    const componentWrapper = new ComponentWrapper(input);
    const result = componentWrapper
      .wrap({ name: 'withRouter' })
      .build();
    expect(result).toBe(output);
  });

  it('should remove old and add new export statement with component wrapped', () => {
    const input = readInputFile('button3');
    const output = readOutputFile('button3');
    const componentWrapper = new ComponentWrapper(input);
    const result = componentWrapper
      .wrap({
        name: 'withRouter',
        import: {
          module: 'react-router',
          subImports: { withRouter: 'withRouter' }
        }
      })
      .build();
    expect(result).toBe(output);
  });

  it('should wrap already wrapped component (innermost)', () => {
    const input = readInputFile('button4');
    const output = readOutputFile('button4');
    const componentWrapper = new ComponentWrapper(input);
    const result = componentWrapper
      .wrap({
        name: 'withAuth',
        import: {
          module: 'auth',
          subImports: { withAuth: 'withAuth' }
        }
      })
      .build();
    expect(result).toBe(output);
  });

  it('should wrap already wrapped component with hoc invoked (innermost)', () => {
    const input = readInputFile('button5');
    const output = readOutputFile('button5');
    const componentWrapper = new ComponentWrapper(input);
    const result = componentWrapper
      .wrap({
        name: 'connect',
        invoke: [],
        import: {
          module: 'react-redux',
          subImports: { connect: 'connect' }
        }
      })
      .build();
    expect(result).toBe(output);
  });

  it('should wrap already wrapped component with hoc invoked (innermost)', () => {
    const input = readInputFile('button4');
    const output = readOutputFile('button4');
    const componentWrapper = new ComponentWrapper(input);
    const result = componentWrapper
      .wrap({
        name: 'connect',
        invoke: [],
        import: {
          module: 'react-redux',
          subImports: { connect: 'connect' }
        }
      })
      .build();
    expect(result).toBe(output);
  });

  it('should wrap component with hoc invoked with arguments', () => {
    const input = readInputFile('button5');
    const output = readOutputFile('button5');
    const componentWrapper = new ComponentWrapper(input);
    const result = componentWrapper
      .wrap({
        name: 'connect',
        invoke: [ 'mapStateToProps' ],
        import: {
          module: 'react-redux',
          subImports: { connect: 'connect' }
        }
      })
      .build();
    expect(result).toBe(output);
  });
});
