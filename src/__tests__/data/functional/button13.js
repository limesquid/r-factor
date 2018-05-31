import React from 'react';

export default (hoc) => {
  const Button = () => (
    <div>
      {hoc}
    </div>
  );

  return Button;
};
