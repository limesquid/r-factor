import React from 'react';
import { withRouter } from 'react-router-dom';

export const hoc = (Component) => {
  const InnerComponent = ({ name }) => (
    <div>
      {name}
    </div>
  );

  return withRouter(InnerComponent);
};
