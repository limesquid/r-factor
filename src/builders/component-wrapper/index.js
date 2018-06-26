const parser = require('../../utils/parser');
const ComponentBuilder = require('./component-builder');
const { getDetails } = require('./utils');

class ComponentWrapper {
  constructor(code, ast) {
    this.code = code;
    this.ast = ast || parser.parse(code);
  }

  refreshDetails() {
    this.details = getDetails(this.ast);
  }

  wrap({ name, invoke, import: importDetails, outermost = false }) {
    this.refreshDetails();
    const builder = new ComponentBuilder(this.code, this.ast);
    builder.setDetails(this.details);
    builder.setWrapperDetails({ name, invoke, outermost });
    this.code = builder.build();
    return this;
  }

  unwrap({ name, import: importDetails }) {
    this.refreshDetails();
    const builder = new ComponentBuilder(this.code, this.ast, this.details);
    return this;
  }

  build() {
    return this.code;
  }
}

module.exports = ComponentWrapper;
