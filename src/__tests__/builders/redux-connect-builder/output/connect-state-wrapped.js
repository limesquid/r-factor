import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

const ButtonComponent = () => (<span>123</span>);

const mapStateToProps = (state) => ({});

export const Button = withRouter(connect(mapStateToProps)(ButtonComponent));
