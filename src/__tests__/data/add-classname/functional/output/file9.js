import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const X = ({ a, className, d, ...rest }) => (
  <div className={classNames(a, className)}>
    asd
  </div>
);

X.propTypes = {
  a: PropTypes.number,
  className: PropTypes.string,
  d: PropTypes.number
};

export default X;
