import React from 'react';

class NotAClass {
  constructor(a, b) {
    this.a = a;
    this.b = b;
    this.sum = this.sum.bind(this);
  }

  sum() {
    return this.a + this.b;
  }
}

const ButtonComponent = (props) => (
  <div>Button</div>
);

export default ButtonComponent;
