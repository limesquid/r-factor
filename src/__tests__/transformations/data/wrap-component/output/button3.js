import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

const ButtonComponent = ({ name }) => (
  <div>
    {name}
  </div>
);

ButtonComponent.propTypes = {
  name: PropTypes.string
};

export const Button = withRouter(ButtonComponent);
