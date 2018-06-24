const SETTINGS = Symbol('settings');

const DEFAULT_SETTINGS = {
  'component-superclass': 'Component',
  'end-of-line': '\n',
  indent: 2,
  'modules-order': [ 'react', 'prop-types', 'classnames' ],
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

  get doubleEndOfLine() {
    return `${this.endOfLine}${this.endOfLine}`;
  }

  get doubleIndent() {
    return 2 * this.indent;
  }

  get endOfLine() {
    return this.get('end-of-line');
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
