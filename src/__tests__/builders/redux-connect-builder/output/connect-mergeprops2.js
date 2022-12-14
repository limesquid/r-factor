import React from 'react';
import { connect } from 'react-redux';

const ButtonComponent = () => (<span>123</span>);

const mapStateToProps = (state) => ({});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps
});

export const Button = connect(mapStateToProps, null, mergeProps)(ButtonComponent);
