import React from 'react';
import { withRouter } from 'react-router';

export const hoc = (Component) => withRouter(({ name }) => (
  <div>
    {name}
  </div>
));
