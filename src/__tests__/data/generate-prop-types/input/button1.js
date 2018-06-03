import React from 'react';

const Button = ({ children, onClick }) => (
  <div onClick={onClick}>
    {children}
  </div>
);
