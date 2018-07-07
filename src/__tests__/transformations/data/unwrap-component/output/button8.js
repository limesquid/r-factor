import React from 'react';
import PropTypes from 'prop-types';

const hoc = ({ name }) => {
  const Button = ({ surname }) => (
    <div>
      {name}
      {surname}
    </div>
  );

  Button.propTypes = {
    surname: PropTypes.string
  };

  return Button;
};

export default hoc;
