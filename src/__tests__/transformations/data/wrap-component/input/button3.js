import React from 'react';
import PropTypes from 'prop-types';

export const Button = ({ name }) => (
  <div>
    {name}
  </div>
);

Button.propTypes = {
  name: PropTypes.string
};
