import React from 'react';
import { connect } from 'react-redux';

const Button = () => (<span>123</span>);

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(Button);
