import React from 'react';
import { connect } from 'react-redux';

const ButtonComponent = () => (<span>123</span>);

const mapState = (state) => ({
  
});

const mapDispatch = (dispatch) => ({

});

const mergeAllProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps
});

export const Button = connect(mapState, mapDispatch, mergeAllProps)(ButtonComponent);
