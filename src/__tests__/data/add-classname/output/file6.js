import React from 'react';
import PropTypes from 'prop-types';

const Component = ({ a, className }) => (
  <div className={className}>
    asd
  </div>
);

Component.propTypes = {
  a: PropTypes.number,
  className: PropTypes.string
};

export default Component;
