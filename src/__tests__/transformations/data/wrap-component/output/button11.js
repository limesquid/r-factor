import React from 'react';
import { withRouter } from 'react-router';

export const hoc = (Component) => {
  const InnerComponent = ({ name }) => (
    <div>
      {name}
    </div>
  );

  return withRouter(InnerComponent);
};
