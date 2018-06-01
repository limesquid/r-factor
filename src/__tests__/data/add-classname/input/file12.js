import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Component = ({ a: b = 1, d: e = 2 }) => (
  <div className={classNames(b, e)}>
    asd
  </div>
);

Component.propTypes = {
  a: PropTypes.number,
  d: PropTypes.number
};

export default Component;
