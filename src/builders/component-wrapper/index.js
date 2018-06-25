class ComponentWrapper {
  constructor(code, ast) {
    this.code = code;
    this.ast = ast;
  }

  wrap({ name, invoke, import: importDetails, outermost = false }) {
    return this;
  }

  unwrap({ name, import: importDetails }) {
    return this;
  }

  build() {
    return this.code;
  }
}

module.exports = ComponentWrapper;
