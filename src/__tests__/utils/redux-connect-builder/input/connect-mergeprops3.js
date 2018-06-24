import React from 'react';
import { connect } from 'react-redux';

const ButtonComponent = () => (<span>123</span>);

const mapDispatchToProps = {};

export const Button = connect(null, mapDispatchToProps)(ButtonComponent);
