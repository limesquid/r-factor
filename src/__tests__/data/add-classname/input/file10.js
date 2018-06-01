import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Component = ({ a, d }) => (
  <div className={classNames(a, d)}>
    asd
  </div>
);

Component.propTypes = {
  a: PropTypes.number,
  d: PropTypes.number
};

export default Component;
