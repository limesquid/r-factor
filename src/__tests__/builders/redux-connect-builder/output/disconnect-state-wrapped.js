import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

const ButtonComponent = ({ name }) => (<span>{name}</span>);

const mapDispatchToProps = {
  
};

export const Button = withAuth(connect(null, mapDispatchToProps)(ButtonComponent));
