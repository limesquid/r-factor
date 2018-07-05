import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.scss';

class Button extends Component {
  static defaultProps = {
    children: 'a',
    className: 'b'
  };

  render() {
    const { className, children, ...props } = this.props;
    const age = 2;

    return (
      <div className={classNames(styles.button, className)} {...props}>
        {children}{age}
      </div>
    );
  }
}

export default Button;
