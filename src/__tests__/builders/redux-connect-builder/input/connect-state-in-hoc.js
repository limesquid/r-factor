import React from 'react';
import { connect } from 'react-redux';

const mapDispatchToProps = (dispatch) => ({
  onAction: () => dispatch({ type: 'do-action' })
});

export const hoc = (Component) => connect(null, mapDispatchToProps)(Component);
