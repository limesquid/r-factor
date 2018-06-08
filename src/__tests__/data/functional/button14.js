import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'components';
import styles from './styles.scss';

const Button = ({ children, className, isDisabled, redirect, onClick }) => {
  const button = (
    <div
      className={classNames(
        styles.button,
        {
          [styles.disabled]: isDisabled
        },
        className
      )}
      onClick={onClick}>
      {children}
    </div>
  );

  if (redirect) {
    return (
      <Link to={redirect}>
        {button}
      </Link>
    );
  }

  return button;
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  isDisabled: PropTypes.bool,
  redirect: PropTypes.string,
  onClick: PropTypes.func
};

export default Button;
