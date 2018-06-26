import React from 'react';
import PropTypes from 'prop-types';
import { withAuth } from 'auth';
import { withRouter } from 'react-router';

const ButtonComponent = ({ name }) => (
  <div>
    {name}
  </div>
);

ButtonComponent.propTypes = {
  name: PropTypes.string
};

export const Button = withRouter(withAuth(ButtonComponent));
