import React from 'react';

const Button = ({ children, style, onClick }) => (
  <div onClick={onClick} style={style}>
    {children}
  </div>
);
