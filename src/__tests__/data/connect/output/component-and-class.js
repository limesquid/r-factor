import React from 'react';
import { connect } from 'react-redux';

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

const mapStateToProps = (state) => ({
  
});

const mapDispatchToProps = {
  
};

export default connect(mapStateToProps, mapDispatchToProps)(ButtonComponent);
