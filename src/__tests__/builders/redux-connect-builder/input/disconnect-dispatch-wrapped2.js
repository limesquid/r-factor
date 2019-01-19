import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

const ButtonComponent = () => (<span>Text</span>);

const mapDispatchToProps = {};

export const Button = withAuth(connect(null, mapDispatchToProps)(ButtonComponent));
