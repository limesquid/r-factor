import React from 'react';
import { connect } from 'react-redux';

const Button = () => (<span>123</span>);

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps
});

export default connect(null, null, mergeProps)(Button);
