import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

const ButtonComponent = () => (<span>123</span>);

const mapStateToProps = (state) => ({});

export const Button = connect(mapStateToProps)(withRouter(ButtonComponent));
