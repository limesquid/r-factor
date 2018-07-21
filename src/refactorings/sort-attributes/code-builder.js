const { Builder } = require('../../model');
const { sortObjectAttributes } = require('../../transformations');

class CodeBuilder extends Builder {
  build() {
    return this.code.replace(
      this.code.substring(this.node.start, this.node.end),
      sortObjectAttributes(this.code, this.node, this.getIndent())
    );
  }
}

module.exports = CodeBuilder;
