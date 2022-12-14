import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.scss';

class Button extends Component {
  static propTypes = {
    onMouseEnter: PropTypes.func,
    children: PropTypes.node
  };

  render() {
    const { className, onClick, onMouseEnter, ...props } = this.props;
    return (
      <div
        className={classNames(styles.button, className)}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        {...props}>
        {this.props.children}
        {this.props.ozet}
      </div>
    );
  }
}

export default Button;
