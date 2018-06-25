import React from 'react';
import { connect } from 'react-redux';

const ButtonComponent = () => (<span>123</span>);

const mapState = (state) => ({});

export const Button = connect(mapState)(ButtonComponent);
