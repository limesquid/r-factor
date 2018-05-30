import React from 'react';

export default (hoc) => {
  const Button = ({ a }) => (
    <div>{hoc}{a}</div>
  );

  return Button;
};
