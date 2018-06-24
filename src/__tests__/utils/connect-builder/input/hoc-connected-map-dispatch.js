import React from 'react';

const mapStateToProps = (state) => ({
  name: 'test'
});

export const hoc = (Component) => connect(mapStateToProps)(Component);
