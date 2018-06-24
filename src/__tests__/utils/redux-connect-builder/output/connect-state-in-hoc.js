import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  onAction: () => dispatch({ type: 'do-action' })
});

export const hoc = (Component) => connect(mapStateToProps, mapDispatchToProps)(Component);
