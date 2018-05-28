import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.scss';

class Button extends Component {

  render() {
    const { className, ...props } = this.props;

    return (
      <div className={classNames(styles.button, className)} {...props}>
        {this.props.children}
      </div>
    );
  }
}

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.any
};

export default Button;
