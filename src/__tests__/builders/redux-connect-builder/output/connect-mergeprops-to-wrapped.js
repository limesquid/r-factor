import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

const ButtonComponent = () => (<span>123</span>);

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps
});

export const Button = withRouter(connect(null, null, mergeProps)(ButtonComponent));
