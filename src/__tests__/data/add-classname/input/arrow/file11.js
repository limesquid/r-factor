import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const X = ({ a: b, d: e }) => (
  <div className={classNames(b, e)}>
    asd
  </div>
);

X.propTypes = {
  a: PropTypes.number,
  d: PropTypes.number
};

export default X;
