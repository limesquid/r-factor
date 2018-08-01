import React from 'react';
import { connect } from 'react-redux';

const ButtonComponent = ({ value }) => (
  <div>{value}</div>
);

const mapStateToProps = (state) => ({
  
});

const mapDispatchToProps = {};

export const Button = connect(mapStateToProps, mapDispatchToProps)(ButtonComponent);
