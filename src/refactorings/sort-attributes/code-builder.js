const { Builder } = require('../../model');
const { printObjectAttributes } = require('../../transformations');

class CodeBuilder extends Builder {
  build() {
    return this.code.replace(
      this.code.substring(this.node.start, this.node.end),
      printObjectAttributes(this.code, this.node, {
        indentSize: this.getIndent(),
        sort: true
      })
    );
  }
}

module.exports = CodeBuilder;
