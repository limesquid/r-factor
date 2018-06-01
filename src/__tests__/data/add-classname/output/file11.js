import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Component = ({ a: b, className, d: e }) => (
  <div className={classNames(b, e, className)}>
    asd
  </div>
);

Component.propTypes = {
  a: PropTypes.number,
  className: PropTypes.string,
  d: PropTypes.number
};

export default Component;
