import React from 'react';
import PropTypes from 'prop-types';

const Component = ({ a, d, ...rest }) => (
  <div className={a}>
    asd
  </div>
);

Component.propTypes = {
  a: PropTypes.number,
  d: PropTypes.number
};

export default Component;
