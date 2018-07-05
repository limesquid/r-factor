import React from 'react';

export const hoc = (Component) => ({ name }) => (
  <div>
    {name}
  </div>
);
