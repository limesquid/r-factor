import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.scss';

class Button extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  static defaultProps = {
    children: 'a',
    className: 'b'
  };

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

a = () => 2;

class X {}

export default Button;
