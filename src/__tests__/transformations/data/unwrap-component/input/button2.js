import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

const Button = ({ name }) => (
  <div>
    {name}
  </div>
);

Button.propTypes = {
  name: PropTypes.string
};

export default withRouter(Button);
