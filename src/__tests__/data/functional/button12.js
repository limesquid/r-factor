import React from 'react';
import PropTypes from 'prop-types';

export default (hoc) => {
  const Button = ({ a }) => (
    <div>
      {hoc}
      {a}
    </div>
  );

  Button.propTypes = {
    a: PropTypes.string
  };

  return Button;
};
