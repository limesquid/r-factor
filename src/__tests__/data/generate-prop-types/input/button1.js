import React from 'react';

const Button = ({ children, disabled, style, onClick }) => (
  <div onClick={onClick} style={style} disabled={disabled}>
    {children}
  </div>
);
