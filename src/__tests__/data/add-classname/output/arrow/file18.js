import React from 'react';
import PropTypes from 'prop-types';

const X = ({ className }) => (
  <div
    a
    b={3}
    className={className}>
    asd
  </div>
);

X.propTypes = {
  className: PropTypes.string
};

export default X;
