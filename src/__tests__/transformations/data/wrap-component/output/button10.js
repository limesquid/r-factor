import React from 'react';
import { withRouter } from 'react-router';

export default Component => {
  const InnerComponent = ({ name }) => (
    <div>
      {name}
    </div>
  );

  return withRouter(InnerComponent);
};
