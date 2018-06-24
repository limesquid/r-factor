import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  name: 'test'
});

export const hoc = (Component) => connect(mapStateToProps)(Component);
