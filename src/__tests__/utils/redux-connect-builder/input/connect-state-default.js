import React from 'react';
import { connect } from 'react-redux';

const Button = () => (<span>123</span>);

const mapDispatchToprops = {};

export default connect(null, mapDispatchToprops)(Button);
