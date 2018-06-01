const { Builder } = require('../../model');
const { cleanUpCode } = require('../../utils');

class ComponentBuilder extends Builder {
  constructor(code) {
    super(code);
  }

  build() {
    if (!this.node) {
      return this.code;
    }

    let code = '';
    code += this.buildPrefix();
    code += this.code.substring(this.node.start, this.node.end);
    code += this.buildSuffix();
    code = cleanUpCode(code);
    return code;
  }
}

module.exports = ComponentBuilder;
