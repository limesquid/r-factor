const SETTINGS = Symbol('settings');

class Settings {
  constructor() {
    this[SETTINGS] = {
      'end-of-line': '\n',
      indent: 2,
      'modules-order': [ 'react', 'prop-types', 'classnames' ]
    };
  }

  get(key) {
    return this[SETTINGS][key];
  }

  set(settings) {
    this[SETTINGS] = {
      ...this[SETTINGS],
      ...settings
    };
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
    return this.get('indent');
  }

  get isModulesOrderAlphabetic() {
    return this.get('modules-order') === 'alphabetic';
  }

  get modulesOrder() {
    return this.get('modules-order');
  }
}

module.exports = new Settings();
