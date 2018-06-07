import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const X = ({
  a,
  d
}) => (
  <div className={classNames(a, d)}>
    asd
  </div>
);

X.propTypes = {
  a: PropTypes.number,
  d: PropTypes.number
};

export default X;
