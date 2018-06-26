import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const ButtonComponent = ({ name }) => (
  <div>
    {name}
  </div>
);

ButtonComponent.propTypes = {
  name: PropTypes.string
};

const mapStateToProps = (state) => ({});

export const Button = connect(mapStateToProps)(ButtonComponent);
