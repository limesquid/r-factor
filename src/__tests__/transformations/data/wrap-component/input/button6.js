import React from 'react';
import PropTypes from 'prop-types';

const ButtonComponent = ({ name }) => (
  <div>
    {name}
  </div>
);

ButtonComponent.propTypes = {
  name: PropTypes.string
};

export const Button = ButtonComponent;
