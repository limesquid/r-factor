import React from 'react';
import PropTypes from 'prop-types';

const X = ({ a, d, ...rest }) => (
  <div className={a}>
    asd
  </div>
);

X.propTypes = {
  a: PropTypes.number,
  d: PropTypes.number
};

export default X;
