import React from 'react';
import PropTypes from 'prop-types';

export const Button = (props) => (
  <div>Button {prop.a}</div>
);

Button.propTypes = {
  a: PropTypes.string
};
