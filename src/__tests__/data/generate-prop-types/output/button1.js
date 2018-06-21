import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ children, onClick }) => (
  <div onClick={onClick}>
    {children}
  </div>
);

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func
};
