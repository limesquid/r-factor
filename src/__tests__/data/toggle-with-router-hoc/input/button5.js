import React from 'react';

export default (hoc) => ({ prop }) => (
  <div>{hoc}Test{prop}</div>
);
