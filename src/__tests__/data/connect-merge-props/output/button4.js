import React from 'react';
import { connect } from 'react-redux';

const ButtonComponent = ({ value }) => (
  <div>{value}</div>
);

const mapDispatchToProps = {};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps
});

export const Button = connect(null, mapDispatchToProps, mergeProps)(ButtonComponent);
