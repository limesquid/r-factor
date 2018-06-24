import React from 'react';
import { connect } from 'react-redux';

const ButtonComponent = () => (<span>123</span>);

export const Button = connect(mapState)(ButtonComponent);
