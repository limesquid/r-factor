import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.scss';

const Button = ({ className, children, ...props }) => (
  <div className={classNames(styles.button, className)} {...props}>
    {children}
  </div>
);

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default Button;
