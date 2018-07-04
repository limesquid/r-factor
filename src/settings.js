const SETTINGS = Symbol('settings');

const DEFAULT_SETTINGS = {
  'component-name-collision-pattern': '${name}Component',
  'component-superclass': 'Component',
  'default-component-name': 'Component',
  'default-hoc-component-name': 'InnerComponent',
  'end-of-line': '\n',
  'functional-component-type': 'arrow',
  indent: 2,
  'map-dispatch-to-props-name': 'mapDispatchToProps',
  'map-state-to-props-name': 'mapStateToProps',
  'map-to-props-prefer-one-line': false,
  'map-to-state-prefer-one-line': false,
  'merge-props-name': 'mergeProps',
  'modules-order': [
    'react',
    'react-dom',
    'prop-types',
    'classnames',
    'lodash',
    'lodash-es',
    'underscore',
    'redux-saga',
    'redux-saga/effects',
    'react-redux',
    'react-router',
    'react-router-redux',
    'redux-actions',
    'reselect',
    're-reselect',
    'react-router-dom',
    'react-hot-loader'
  ],
  quotes: 'single',
  semicolons: true
};

class Settings {
  constructor() {
    this[SETTINGS] = DEFAULT_SETTINGS;
  }

  get(key) {
    return this[SETTINGS][key];
  }

  revert() {
    this[SETTINGS] = DEFAULT_SETTINGS;
  }

  set(settings) {
    this[SETTINGS] = {
      ...this[SETTINGS],
      ...settings
    };
  }

  get componentSuperclass() {
    return this.get('component-superclass');
  }

  get componentNameCollisionPattern() {
    return this.get('component-name-collision-pattern');
  }

  get defaultComponentName() {
    return this.get('default-component-name');
  }

  get defaultHocComponentName() {
    return this.get('default-hoc-component-name');
  }

  get doubleEndOfLine() {
    return `${this.endOfLine}${this.endOfLine}`;
  }

  get doubleIndent() {
    return 2 * this.indent;
  }

  get endOfLine() {
    return this.get('end-of-line');
  }

  get functionalComponentType() {
    return this.get('functional-component-type');
  }

  get indent() {
    const indent = this.get('indent');
    return indent === 'tab' ? 1 : indent;
  }

  get indentCharacter() {
    return this.get('indent') === 'tab' ? '\t' : ' ';
  }

  get isModulesOrderAlphabetic() {
    return this.get('modules-order') === 'alphabetic';
  }

  get mapDispatchToPropsName() {
    return this.get('map-dispatch-to-props-name');
  }

  get mapStateToPropsName() {
    return this.get('map-state-to-props-name');
  }

  get mapToPropsPreferOneLine() {
    return this.get('map-to-props-prefer-one-line');
  }

  get mapToStatePreferOneLine() {
    return this.get('map-to-state-prefer-one-line');
  }

  get mergePropsName() {
    return this.get('merge-props-name');
  }


  get modulesOrder() {
    return this.get('modules-order');
  }

  get quote() {
    const quotes = this.get('quotes');
    if (quotes === 'double') {
      return '"';
    }
    if (quotes === 'backtick') {
      return '`';
    }
    return '\'';
  }

  get semicolon() {
    return this.get('semicolons') ? ';' : '';
  }
}

module.exports = new Settings();
