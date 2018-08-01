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
    f: PropTypes.func.isRequired
  };

  return Button;
};
