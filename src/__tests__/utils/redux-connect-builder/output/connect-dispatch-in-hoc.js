import React from 'react';

const mapStateToProps = (state) => ({
  name: 'test'
});

const mapDispatchToProps = {};

export const hoc = (Component) => connect(mapStateToProps, mapDispatchToProps)(Component);
