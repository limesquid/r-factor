import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.scss';

function Button({ className, children, ...props }) {
  const a = 2;

  return (
    <div className={classNames(styles.button, className)} {...props}>
      {children}
    </div>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

Button.defaultProps = {
  children: 'a',
  className: 'b'
};

export default Button;
