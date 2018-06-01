import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Component = ({ a: b = 1, d: e = 2 }) => (
  <div
    a={3}
    className={classNames(b, e)}
    d={4}>
    asd
  </div>
);

Component.propTypes = {
  a: PropTypes.number,
  d: PropTypes.number
};

export default Component;
