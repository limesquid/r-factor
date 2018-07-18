import React from 'react';
import { connect } from 'react-redux';

const Component = (props) => (
  <div>Button</div>
);

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
