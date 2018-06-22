import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ children, style, onClick }) => (
  <div onClick={onClick} style={style}>
    {children}
  </div>
);

Button.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
  onClick: PropTypes.func
};
