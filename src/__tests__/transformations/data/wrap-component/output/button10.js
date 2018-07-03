import React from 'react';
import { withRouter } from 'react-router';

export default (Component) => withRouter(({ name }) => (
  <div>
    {name}
  </div>
));
