import React from 'react';

export default (hoc) => {
  const Button = () => (
    <div>{hoc}Test</div>
  );

  return Button;
};
