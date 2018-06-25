import React from 'react';
import { connect } from 'react-redux';

const Button = () => (<span>123</span>);

function mapDispatchToprops() {
  return {};
}

export default connect(null, mapDispatchToprops)(Button);
