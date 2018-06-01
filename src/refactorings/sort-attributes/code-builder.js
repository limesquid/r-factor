const { Builder } = require('../../model');
const { getIndent } = require('../../utils');
const { sortObjectAttributes } = require('../../transformations');

class CodeBuilder extends Builder {
  constructor(code) {
    super(code);
    this.nodes = [];
  }

  build() {
    for (const node of this.nodes) {
      const updated = this.code.replace(
        this.code.substring(node.start, node.end),
        sortObjectAttributes(this.code, this.getIndent(node), node)
      );
      if (updated !== this.code) {
        return updated;
      }
    }
    return this.code;
  }

  getIndent(node) {
    return getIndent(this.code, node.start);
  }

  addNode(node) {
    this.nodes.push(node);
  }
}

module.exports = CodeBuilder;
