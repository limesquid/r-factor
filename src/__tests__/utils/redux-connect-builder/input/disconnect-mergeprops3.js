import React from 'react';
import { connect } from 'react-redux';

const Button = () => (<span>123</span>);

const mapDispatchToProps = {};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps
});

export default conenct(null, mapDispatchToProps, mergeProps)(Button);
