import React from 'react';
import { withRouter } from 'react-router-dom';

export default (Component) => {
  const InnerComponent = ({ name }) => (
    <div>
      {name}
    </div>
  );

  return withRouter(InnerComponent);
};
