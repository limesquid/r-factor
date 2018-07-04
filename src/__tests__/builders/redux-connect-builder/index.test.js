const { readBuilderFile } = require('../../test-utils');
const parser = require('../../../utils/parser');
const ReduxConnectBuilder = require('../../../builders/redux-connect-builder');
const settings = require('../../../settings');

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
  // {
  //   filename: 'disconnect-dispatch-wrapped',
  //   actions: [ 'diconnectDispatch' ]
  // },
  // {
  //   filename: 'disconnect-dispatch-wrapped2',
  //   actions: [ 'disconnect', 'diconnectDispatch' ]
  // },
  // {
  //   filename: 'disconnect-dispatch',
  //   actions: [ 'diconnectDispatch' ]
  // },
  // {
  //   filename: 'disconnect-dispatch2',
  //   actions: [ 'disconnect', 'diconnectDispatch' ]
  // },
  // {
  //   filename: 'disconnect-mergeprops',
  //   actions: [ 'disconnect', 'disconnectMergeProps' ]
  // },
  // {
  //   filename: 'disconnect-mergeprops2',
  //   actions: [ 'disconnectMergeProps' ]
  // },
  // {
  //   filename: 'disconnect-mergeprops3',
  //   actions: [ 'disconnectMergeProps' ]
  // },
  // {
  //   filename: 'disconnect-state-wrapped',
  //   actions: [ 'disconnectState' ]
  // },
  // {
  //   filename: 'disconnect-state-wrapped2',
  //   actions: [ 'disconnect', 'disconnectState' ]
  // },
  // {
  //   filename: 'disconnect-state',
  //   actions: [ 'disconnectState' ]
  // },
  // {
  //   filename: 'disconnect-wrapped',
  //   actions: [ 'disconnect' ]
  // },
  // {
  //   filename: 'disconnect',
  //   actions: [ 'disconnect' ]
  // },
  // {
  //   filename: 'disconnect2',
  //   actions: [ 'disconnect' ]
  // },
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
  }
].map((test) => ({
  ...test,
  input: readBuilderFile(`redux-connect-builder/input/${test.filename}.js`),
  output: readBuilderFile(`redux-connect-builder/output/${test.filename}.js`)
}));

describe('ReduxConnectBuilder', () => {
  beforeAll(() => {
    settings.set({
      'map-to-dispatch-prefer-object': true,
      'map-to-state-prefer-one-line': true
    });
  });

  afterAll(() => {
    settings.revert();
  });

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
});

describe('ReduxConnectBuilder: settings', () => {
  beforeAll(() => {
    settings.set({
      'map-dispatch-to-props-name': "mapDispatch",
      'map-state-to-props-name': "mapState",
      'map-to-dispatch-prefer-object': false,
      'map-to-state-prefer-one-line': false,
      'merge-props-name': "mergeAllProps"
    });
  });

  afterAll(() => {
    settings.revert();
  });

  it('Should use settings properly while generating connect functions', () => {
    const input = readBuilderFile('redux-connect-builder/input/settings.js');
    const output = readBuilderFile('redux-connect-builder/output/settings.js');
    const ast = parser.parse(input);
    const builder = new ReduxConnectBuilder(input, ast);
    const result = builder
      .connect()
      .connectMergeProps()
      .build();
    expect(result).toBe(output);
  });
});
