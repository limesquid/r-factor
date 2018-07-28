import React from 'react';
import { connect } from 'react-redux';

const ButtonComponent = ({ name }) => (<span>{name}</span>);

const mapDispatchToProps = {};

export const Button = connect(null, mapDispatchToProps)(ButtonComponent);
