class Settings {
  constructor() {
    this.settings = {
      indent: 2,
      'modules-order': [ 'react', 'prop-types', 'classnames' ]
    };
  }

  set(settings) {
    this.settings = {
      ...this.settings,
      ...settings
    };
  }

  get(key) {
    return this.settings[key];
  }
}

module.exports = new Settings();
