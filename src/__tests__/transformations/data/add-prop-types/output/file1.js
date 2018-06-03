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
    b: PropTypes.bool,
    f: PropTypes.func.isRequired
  };

  return Button;
};
