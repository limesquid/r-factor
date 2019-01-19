import React from 'react';
import { withRouter } from 'react-router-dom';

export default (hoc) => {
  const InnerComponent = ({ prop }) => (
    <div>{hoc}Test{prop}</div>
  );

  return withRouter(InnerComponent);
};
