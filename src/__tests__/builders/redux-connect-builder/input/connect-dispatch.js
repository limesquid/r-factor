import React from 'react';
import { connect } from 'react-redux';

const ButtonComponent = () => (<span>123</span>);

const mapStateToProps = (state) => ({
  
});

export const Button = connect(mapStateToProps)(ButtonComponent);
