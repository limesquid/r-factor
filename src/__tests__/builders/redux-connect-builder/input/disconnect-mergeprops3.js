import React from 'react';
import { connect } from 'react-redux';

const Button = () => (<span>Text</span>);

const mapDispatchToProps = {};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps
});

export default connect(null, mapDispatchToProps, mergeProps)(Button);
