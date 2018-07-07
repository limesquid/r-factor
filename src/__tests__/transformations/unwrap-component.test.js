const { readTransformationsFile } = require('../test-utils');
const unwrapComponent = require('../../transformations/unwrap-component');

const readInputFile = (filename) => readTransformationsFile(`unwrap-component/input/${filename}.js`);
const readOutputFile = (filename) => readTransformationsFile(`unwrap-component/output/${filename}.js`);

const tests = [
  {
    filename: 'button1',
    unwrapOptions: {
      name: 'withRouter',
      importDetails: {
        module: 'react-router',
        removeImportIfEmpty: true,
        subImports: [ 'withRouter' ]
      }
    }
  },
  {
    filename: 'button2',
    unwrapOptions: {
      name: 'withRouter',
      importDetails: {
        module: 'react-router',
        removeImportIfEmpty: true,
        subImports: [ 'withRouter' ]
      }
    }
  },
  {
    filename: 'button3',
    unwrapOptions: {
      name: 'withRouter',
      importDetails: {
        module: 'react-router',
        removeImportIfEmpty: true,
        subImports: [ 'withRouter' ]
      }
    }
  },
  {
    filename: 'button4',
    unwrapOptions: {
      name: 'withRouter',
      importDetails: {
        module: 'react-router',
        removeImportIfEmpty: true,
        subImports: [ 'withRouter' ]
      }
    }
  },
  {
    filename: 'button5',
    unwrapOptions: {
      name: 'withAuth',
      importDetails: {
        module: 'auth',
        removeImportIfEmpty: true,
        identifier: true
      }
    }
  },
  {
    filename: 'button6',
    unwrapOptions: {
      name: 'connect',
      importDetails: {
        module: 'react-redux',
        removeImportIfEmpty: true,
        subImports: [ 'connect' ]
      },
      removeInvoked: true
    }
  },
  {
    filename: 'button7',
    unwrapOptions: {
      name: 'connect',
      importDetails: {
        module: 'react-redux',
        removeImportIfEmpty: true,
        subImports: [ 'connect' ]
      },
      removeInvoked: true
    }
  },
  {
    filename: 'button8',
    unwrapOptions: {
      name: 'withRouter',
      importDetails: {
        module: 'react-router',
        removeImportIfEmpty: true,
        subImports: [ 'withRouter' ]
      },
      removeInvoked: true
    }
  },
  {
    filename: 'button9',
    unwrapOptions: {
      name: 'withRouter',
      importDetails: {
        module: 'react-router',
        removeImportIfEmpty: true,
        subImports: [ 'withRouter' ]
      }
    }
  },
  {
    filename: 'button10',
    unwrapOptions: {
      name: 'withAuth',
      importDetails: {
        module: 'auth',
        removeImportIfEmpty: true,
        identifier: true
      }
    }
  },
  {
    filename: 'button11',
    unwrapOptions: {
      name: 'withRouter',
      importDetails: {
        module: 'react-router',
        removeImportIfEmpty: true,
        subImports: [ 'withRouter' ]
      }
    }
  },
  {
    filename: 'button12',
    unwrapOptions: {
      name: 'connect',
      importDetails: {
        module: 'react-redux',
        removeImportIfEmpty: true,
        subImports: [ 'connect' ]
      }
    }
  },
  {
    filename: 'button13',
    unwrapOptions: {
      name: 'connect',
      importDetails: {
        module: 'react-redux',
        removeImportIfEmpty: true,
        subImports: [ 'connect' ]
      },
      removeInvoked: false
    }
  }
].map((test) => ({
  ...test,
  input: readInputFile(test.filename),
  output: readOutputFile(test.filename)
}));

describe('transformation:unwrap-component', () => {
  tests.forEach((test) => {
    describe(test.filename, () => {
      const { input, output, unwrapOptions } = test;
      it(`should unwrap ${unwrapOptions.name}`, () => {
        const result = unwrapComponent(input, undefined, unwrapOptions);
        expect(result).toBe(output);
      });
    });
  });
});

