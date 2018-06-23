import _ from 'lodash';
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const Header = ({ children, className, onClick }) => (
  <div className={classNames(`header`, className)} onClick={_.debounce(onClick, 100)}>
    {children}
  </div>
);

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
