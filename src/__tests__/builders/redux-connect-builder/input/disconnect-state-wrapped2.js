import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

const ButtonComponent = ({ name }) => (<span>{name}</span>);

const mapStateToProps = (state) => ({
  name: state.name
});

export const Button = withAuth(connect(mapStateToProps)(ButtonComponent));
