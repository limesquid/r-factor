import React from 'react';
import { connect } from 'react-redux';

const ButtonComponent = (props) => (
  <div>Button</div>
);

const mapDispatchToProps = {
  
};

export const Button = connect(null, mapDispatchToProps)(ButtonComponent);
