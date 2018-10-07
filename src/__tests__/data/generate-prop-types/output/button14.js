import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ children, onClick }) => (
  <div>
    {children}
  </div>
);

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func
};

export default Button;
