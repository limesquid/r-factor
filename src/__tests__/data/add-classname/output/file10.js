import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Component = ({ a, className, d }) => (
  <div className={classNames(a, d, className)}>
    asd
  </div>
);

Component.propTypes = {
  a: PropTypes.number,
  className: PropTypes.string,
  d: PropTypes.number
};

export default Component;
