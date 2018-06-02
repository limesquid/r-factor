import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const X = ({ a: b = 1, className, d: e = 2 }) => (
  <div
    a={3}
    className={classNames(
      b,
      e,
      className
    )}
    d={4}>
    asd
  </div>
);

X.propTypes = {
  a: PropTypes.number,
  className: PropTypes.string,
  d: PropTypes.number
};

export default X;
