import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  name: 'test'
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps
});

export const hoc = (Component) => connect(mapStateToProps, null, mergeProps)(Component);
