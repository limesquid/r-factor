import React from 'react';
import PropTypes from 'prop-types';

export default (hoc) => {
  function Button({ a }) {
    return (
      <div>
        {hoc}
        {a}
      </div>
    );
  }

  Button.propTypes = {
    a: PropTypes.string
  };

  return Button;
};
