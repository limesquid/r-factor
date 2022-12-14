import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.scss';

class Button extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    defaultValue: PropTypes.any
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.defaultValue
    };
  }

  render() {
    const { className, ...props } = this.props;

    return (
      <div className={classNames(styles.button, className)} {...props}>
        {this.props.children}
      </div>
    );
  }
}

export default Button;
