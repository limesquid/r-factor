const { readBuilderFile } = require('../../test-utils');
const parser = require('../../../utils/parser');
const ReduxConnectBuilder = require('../../../builders/redux-connect-builder');
const settings = require('../../../settings');

const tests = [
  {
    filename: 'disconnect-dispatch-wrapped',
    actions: [ 'disconnectDispatch' ]
  },
  {
    filename: 'disconnect-dispatch-wrapped2',
    actions: [ 'disconnect', 'disconnectDispatch' ]
  },
  {
    filename: 'disconnect-dispatch',
    actions: [ 'disconnectDispatch' ]
  },
  {
    filename: 'disconnect-dispatch2',
    actions: [ 'disconnect', 'disconnectDispatch' ]
  },
  {
    filename: 'disconnect-mergeprops',
    actions: [ 'disconnect', 'disconnectMergeProps' ]
  },
  {
    filename: 'disconnect-mergeprops2',
    actions: [ 'disconnectMergeProps' ]
  },
  {
    filename: 'disconnect-mergeprops3',
    actions: [ 'disconnectMergeProps' ]
  },
  {
    filename: 'disconnect-state-wrapped',
    actions: [ 'disconnectState' ]
  },
  {
    filename: 'disconnect-state-wrapped2',
    actions: [ 'disconnect', 'disconnectState' ]
  },
  {
    filename: 'disconnect-state',
    actions: [ 'disconnectState' ]
  },
  {
    filename: 'disconnect-wrapped',
    actions: [ 'disconnect' ]
  },
  {
    filename: 'disconnect',
    actions: [ 'disconnect' ]
  },
  {
    filename: 'disconnect2',
    actions: [ 'disconnect' ]
  },
  {
    filename: 'disconnect3',
    actions: [ 'disconnect' ]
  },
  {
    filename: 'disconnect4',
    actions: [ 'disconnect' ]
  }
].map((test) => ({
  ...test,
  input: readBuilderFile(`redux-connect-builder/input/${test.filename}.js`),
  output: readBuilderFile(`redux-connect-builder/output/${test.filename}.js`)
}));

describe('ReduxConnectBuilder', () => {
  tests.forEach((test) => {
    describe(test.filename, () => {
      test.actions.forEach((action) => {
        it(action, () => {
          const code = test.input;
          const ast = parser.parse(code);
          const builder = new ReduxConnectBuilder(code, ast);
          builder[action]();
          expect(builder.build()).toBe(test.output);
        });
      });
    });
  });

  describe('disocnnect (chaining)', () => {
    const input = readBuilderFile(`redux-connect-builder/input/disconnect2.js`);
    const output = readBuilderFile(`redux-connect-builder/output/disconnect2.js`);
    const builder = new ReduxConnectBuilder(input);
    const result = builder
      .disconnectState()
      .disconnectDispatch()
      .disconnectState()
      .disconnectMergeProps()
      .disconnectDispatch()
      .disconnectMergeProps()
      .build();
    expect(result).toBe(output);
  });
});
