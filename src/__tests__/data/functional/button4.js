import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.scss';

const Button = ({ className, children, ...props }) => {
  const a = 2;

  return (
    <div className={classNames(styles.button, className)} {...props}>
      {children}
    </div>
  );
};

Button.defaultProps = {
  children: 'a',
  className: 'b'
};

export default Button;
