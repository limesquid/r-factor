import React from 'react';

export default (hoc) => {
  const text = 'Test text';

  const Button = () => (
    <div>{hoc}Test{text}</div>
  );

  return Button;
};
