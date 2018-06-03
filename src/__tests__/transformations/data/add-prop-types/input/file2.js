import React from 'react';

export default (hoc) => {
  const Button = ({ a }) => (
    <div>
      {hoc}
      {a}
    </div>
  );

  Button.propTypes = {
  };

  return Button;
};
