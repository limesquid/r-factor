const { getIndent } = require('../utils');

class Builder {
  constructor(code, node = null) {
    this.code = code;
    this.node = node;
  }

  build() {
    return this.code;
  }

  buildPrefix() {
    return this.code.substring(0, this.node.start);
  }

  buildSuffix() {
    return this.code.substring(this.node.end);
  }

  getIndent() {
    return getIndent(this.code, this.node.start);
  }

  setNode(node) {
    this.node = node;
  }
}

module.exports = Builder;
