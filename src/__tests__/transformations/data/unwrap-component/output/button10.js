import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

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

  return withRouter(Button);
};

export default hoc;
