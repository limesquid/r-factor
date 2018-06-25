import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

const ButtonComponent = ({ name }) => (
  <div>
    {name}
  </div>
);

ButtonComponent.propTypes = {
  name: PropTypes.string
};

const mapStateToProps = (state) => ({});

export const Button = withRouter(connect(mapStateToProps)(ButtonComponent));
