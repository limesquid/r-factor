import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'components';
import styles from './styles.scss';

class Button extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    isDisabled: PropTypes.bool,
    redirect: PropTypes.string,
    onClick: PropTypes.func
  };

  render() {
    const { children, className, isDisabled, redirect, onClick } = this.props;

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
  }
}

export default Button;
