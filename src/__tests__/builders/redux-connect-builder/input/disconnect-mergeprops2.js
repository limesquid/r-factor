import React from 'react';
import { connect } from 'react-redux';

const Button = ({ name }) => (<span>{name}</span>);

const mapStateToProps = (state) => ({
  name: state.name
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps
});

export default connect(mapStateToProps, null, mergeProps)(Button);
