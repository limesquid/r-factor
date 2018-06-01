import React from 'react';
import PropTypes from 'prop-types';

const Component = ({ className }) => (
  <div className={className}>
    asd
  </div>
);

Component.propTypes = {
  className: PropTypes.string
};

export default Component;
