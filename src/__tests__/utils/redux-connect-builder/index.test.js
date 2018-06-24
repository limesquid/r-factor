const fs = require('fs');
const { readUtilsFile } = require('../../test-utils');
const parser = require('../../../utils/parser');
const ReduxConnectBuilder = require('../../../utils/redux-connect-builder');

const tests = [
  {
    filename: 'connect-dispatch-in-hoc',
    actions: [ 'connect', 'connectDispatch' ]
  },
  {
    filename: 'connect-dispatch-to-not-connected',
    actions: [ 'connectDispatch' ]
  },
  {
    filename: 'connect-dispatch-wrapped',
    actions: [ 'connectDispatch' ]
  },
  {
    filename: 'connect-dispatch',
    actions: [ 'connect', 'connectDispatch' ]
  },
  {
    filename: 'connect-identity',
    actions: [ 'connect', 'connectState', 'connectDispatch' ]
  },
  {
    filename: 'connect-state-default',
    actions: [ 'connect', 'connectState' ]
  },
  {
    filename: 'connect-state-function-identity',
    actions: [ 'connectState' ]
  },
  {
    filename: 'connect-state-function',
    actions: [ 'connect', 'connectState' ]
  },
  {
    filename: 'connect-state-identity',
    actions: [ 'connectState' ]
  },
  {
    filename: 'connect-state-named-not-defined',
    actions: [ 'connectState' ]
  },
  {
    filename: 'connect-state-in-hoc',
    actions: [ 'connect', 'connectState' ]
  },
  {
    filename: 'connect-state-to-not-connected',
    actions: [ 'connectState' ]
  },
  {
    filename: 'connect-state-wrapped',
    actions: [ 'connectState' ]
  },
  {
    filename: 'connect-state-wrapped2',
    actions: [ 'connectState' ]
  },
  {
    filename: 'connect-state',
    actions: [ 'connect', 'connectState' ]
  },
  {
    filename: 'connect-wrapped',
    actions: [ 'connect' ]
  },
  {
    filename: 'connect-wrapped2',
    actions: [ 'connect' ]
  },
  {
    filename: 'connect-wrapped3',
    actions: [ 'connect' ]
  },
  {
    filename: 'disconnect-dispatch-wrapped',
    actions: [ 'diconnectDispatch' ]
  },
  {
    filename: 'disconnect-dispatch-wrapped2',
    actions: [ 'disconnect', 'diconnectDispatch' ]
  },
  {
    filename: 'disconnect-dispatch',
    actions: [ 'diconnectDispatch' ]
  },
  {
    filename: 'disconnect-dispatch2',
    actions: [ 'disconnect', 'diconnectDispatch' ]
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
    filename: 'connect-mergeprops-in-hoc',
    actions: [ 'connectMergeProps' ]
  },
  {
    filename: 'connect-mergeprops-to-disconnected',
    actions: [ 'connectMergeProps' ]
  },
  {
    filename: 'connect-mergeprops-to-wrapped',
    actions: [ 'connectMergeProps' ]
  },
  {
    filename: 'connect-mergeprops',
    actions: [ 'connectMergeProps' ]
  },
  {
    filename: 'connect-mergeprops2',
    actions: [ 'connectMergeProps' ]
  },
  {
    filename: 'connect-mergeprops3',
    actions: [ 'connectMergeProps' ]
  },
].map((test) => ({
  ...test,
  input: readUtilsFile(`redux-connect-builder/input/${test.filename}.js`),
  output: readUtilsFile(`redux-connect-builder/output/${test.filename}.js`)
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
        })
      });
    });
  });
});
