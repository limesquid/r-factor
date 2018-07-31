import React from 'react';
import { connect } from 'react-redux';

const ButtonComponent = ({ value }) => (
  <div>{value}</div>
);

const mapStateToProps = (state) => ({
  
});

export const Button = connect(mapStateToProps)(ButtonComponent);
