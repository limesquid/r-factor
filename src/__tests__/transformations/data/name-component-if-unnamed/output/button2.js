import React from 'react';

export const hoc = (Component) => {
  const Component = ({ name }) => (
    <div>
      {name}
    </div>
  );

  return Component;
};
