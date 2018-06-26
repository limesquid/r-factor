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
           v,
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

  it('should wrap component with hoc invoked with arguments', () => {
    const input = readInputFile('button6');
    const output = readOutputFile('button6');
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

  it('should wrap component (outermost)', () => {
    const input = readInputFile('button7');
    const output = readOutputFile('button7');
    const componentWrapper = new ComponentWrapper(input);
    const result = componentWrapper
      .wrap({
        name: 'withRouter',
        outermost: true,
        import: {
          module: 'react-router',
          subImports: { withRouter: 'withRouter' }
        }
      })
      .build();
    expect(result).toBe(output);
  });

  it('should wrap component returned in hoc', () => {
    const input = readInputFile('button8');
    const output = readOutputFile('button8');
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

  it('should wrap already wrapped component returned in hoc (outermost)', () => {
    const input = readInputFile('button9');
    const output = readOutputFile('button9');
    const componentWrapper = new ComponentWrapper(input);
    const result = componentWrapper
      .wrap({
        name: 'withAuth',
        outermost: true,
        import: {
          module: 'auth',
          subImports: { withAuth: 'withAuth' }
        }
      })
      .build();
    expect(result).toBe(output);
  });

  it('should add body to hoc and wrap inner component (default export)', () => {
    const input = readInputFile('button10');
    const output = readOutputFile('button10');
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

  it('should add body to hoc and wrap inner component (named export)', () => {
    const input = readInputFile('button11');
    const output = readOutputFile('button11');
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
});
