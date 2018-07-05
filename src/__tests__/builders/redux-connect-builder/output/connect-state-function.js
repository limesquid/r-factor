import React from 'react';
import { connect } from 'react-redux';

const Button = () => (<span>123</span>);

const mapStateToProps = (state) => ({});

function mapDispatchToprops() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToprops)(Button);
