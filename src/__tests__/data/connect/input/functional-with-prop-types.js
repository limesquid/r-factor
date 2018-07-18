import React from 'react';
import PropTypes from 'prop-types';

export const Button = (props) => (
  <div>Button {prop.name}</div>
);

Button.propTypes = {
  name: PropTypes.string
};
