import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.scss';

class Button extends Component {
  render() {
    const { className, children, ...props } = this.props;
    const a = 2;

    return (
      <div className={classNames(styles.button, className)} {...props}>
        {children}
      </div>
    );
  }
}

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default Button;
