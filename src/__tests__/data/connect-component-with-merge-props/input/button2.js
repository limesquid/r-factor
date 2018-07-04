import React from 'react';
import { connect } from 'react-redux';

const ButtonComponent = (props) => (
  <div>Button</div>
);

const mapStateToProps = (state) => ({});

export const Button = connect(mapStateToProps)(ButtonComponent);
