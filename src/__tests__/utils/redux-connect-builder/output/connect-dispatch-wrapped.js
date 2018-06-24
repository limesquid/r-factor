import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

const ButtonComponent = () => (<span>123</span>);

const mapDispatchToProps = {};

export const Button = withRouter(connect(null, mapDispatchToProps)(ButtonComponent));
