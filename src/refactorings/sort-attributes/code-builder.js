const { Builder } = require('../../model');
const { getIndent } = require('../../utils');
const { sortObjectAttributes } = require('../../transformations');

class CodeBuilder extends Builder {
  constructor(code) {
    super(code);
    this.nodes = [];
  }

  build() {
    const nodes = [ ...this.nodes ].reverse();
    return nodes.reduce(
      (code, node) => code.replace(
        code.substring(node.start, node.end),
        sortObjectAttributes(this.code, this.getIndent(node), node)
      ),
      this.code
    );
  }

  getIndent(node) {
    return getIndent(this.code, node.start);
  }

  addNode(node) {
    this.nodes.push(node);
  }
}

module.exports = CodeBuilder;
