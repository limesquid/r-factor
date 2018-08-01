import React from 'react';
import { connect } from 'react-redux';

const ButtonComponent = ({ value }) => (
  <div>{value}</div>
);

const mapDispatchToProps = {};

export const Button = connect(null, mapDispatchToProps)(ButtonComponent);
