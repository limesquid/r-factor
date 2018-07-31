import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  name: 'test'
});

const mapDispatchToProps = {
  
};

export const hoc = (Component) => connect(mapStateToProps, mapDispatchToProps)(Component);
