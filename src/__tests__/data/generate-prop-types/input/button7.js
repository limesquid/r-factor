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
    const { className, hasOutline, isDisabled, onClick, onMouseEnter, ...props } = this.props;
    return (
      <div
        className={classNames(
          styles.button,
          {
            [styles.disabled]: isDisabled,
            [styles.outline]: hasOutline
          },
          className
        )}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={this.props.onMouseLeave}
        {...props}>
        {this.props.children}
        {this.props.ozet}
      </div>
    );
  }
}

export default Button;
