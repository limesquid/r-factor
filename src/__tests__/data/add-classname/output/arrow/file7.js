import React from 'react';
import PropTypes from 'prop-types';

const X = ({ a, className, d }) => (
  <div className={className}>
    asd
  </div>
);

X.propTypes = {
  a: PropTypes.number,
  className: PropTypes.string,
  d: PropTypes.number
};

export default X;
