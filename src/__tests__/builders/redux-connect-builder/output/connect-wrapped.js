import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

const ButtonComponent = () => (<span>123</span>);

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export const Button = withRouter(connect(mapStateToProps, mapDispatchToProps)(ButtonComponent));
