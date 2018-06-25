import React from 'react';

export default (hoc) => {
  function Button() {
    return (
      <div>
        {hoc}
      </div>
    );
  }

  return Button;
};
