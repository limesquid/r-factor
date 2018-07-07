import React from 'react';
import PropTypes from 'prop-types';
import { withAuth } from 'auth';

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

  return withAuth(Button);
};

export default hoc;
