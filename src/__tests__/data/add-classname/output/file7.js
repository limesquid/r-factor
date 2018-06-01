import React from 'react';
import PropTypes from 'prop-types';

const Component = ({ a, className, d }) => (
  <div className={className}>
    asd
  </div>
);

Component.propTypes = {
  a: PropTypes.number,
  className: PropTypes.string,
  d: PropTypes.number
};

export default Component;
