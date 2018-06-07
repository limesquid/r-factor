const SETTINGS = Symbol('settings');

class Settings {
  constructor() {
    this[SETTINGS] = {
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

  get doubleIndent() {
    return 2 * this.indent;
  }

  get indent() {
    return this.get('indent');
  }

  get modulesOrder() {
    return this.get('modules-order');
  }
}

module.exports = new Settings();
