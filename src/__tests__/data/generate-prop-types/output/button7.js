import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.scss';

class Button extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.any,
    ozet: PropTypes.any,
    onClick: PropTypes.any,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.any
  };

  render() {
    const { className, onClick, onMouseEnter, ...props } = this.props;
    return (
      <div
        className={classNames(styles.button, className)}
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
