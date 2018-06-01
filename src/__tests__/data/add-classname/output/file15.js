import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Component = ({ a: b = 1, className, d: e = 2 }) => (
  <div
    a={3}
    className={classNames(b, e, className)}>
    asd
  </div>
);

Component.propTypes = {
  a: PropTypes.number,
  className: PropTypes.string,
  d: PropTypes.number
};

export default Component;
