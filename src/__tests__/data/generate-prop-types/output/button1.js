import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ children, disabled, style, onClick }) => (
  <div onClick={onClick} style={style} disabled={disabled}>
    {children}
  </div>
);

Button.propTypes = {
  children: PropTypes.node,
  disabled: PropTypes.bool,
  style: PropTypes.object,
  onClick: PropTypes.func
};
