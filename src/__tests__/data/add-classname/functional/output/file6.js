import React from 'react';
import PropTypes from 'prop-types';

const X = ({ a, className }) => (
  <div className={className}>
    asd
  </div>
);

X.propTypes = {
  a: PropTypes.number,
  className: PropTypes.string
};

export default X;
