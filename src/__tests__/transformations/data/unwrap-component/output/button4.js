import React from 'react';
import PropTypes from 'prop-types';
import { withAuth } from 'auth';

const ButtonComponent = ({ name }) => (
  <div>
    {name}
  </div>
);

ButtonComponent.propTypes = {
  name: PropTypes.string
};

export const Button = withAuth(ButtonComponent);
