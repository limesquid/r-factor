import React from 'react';
import PropTypes from 'prop-types';

const X = ({ className, ...props }) => (
  <div className={className}>
    asd
  </div>
);

X.propTypes = {
  className: PropTypes.string
};

export default X;
