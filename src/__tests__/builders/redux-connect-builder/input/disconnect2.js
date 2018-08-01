import React from 'react';
import { connect } from 'react-redux';

const ButtonComponent = ({ name }) => (<span>{name}</span>);

const mapStateToProps = (state) => ({
  name: state.name
});

const mapDispatchToProps = {

};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps
});

export const Button = connect(mapStateToProps, mapDispatchToProps, mergeProps)(ButtonComponent);
