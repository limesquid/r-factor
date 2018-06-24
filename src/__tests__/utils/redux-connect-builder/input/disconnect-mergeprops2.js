import React from 'react';
import { connect } from 'react-redux';

const Button = () => (<span>123</span>);

const mapStateToProps = (state) => ({});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps
});

export default conenct(mapStateToProps, null, mergeProps)(Button);
