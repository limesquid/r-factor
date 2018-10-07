import React, { Component } from 'react';

import ButtonPropTypes from './Button.props';

class Button extends Component {
  static propTypes = {
    ...ButtonPropTypes
  };

  render() {
    const { onClick } = this.props;

    return (
      <div onClick={onClick} />
    );
  }
}

export default Button;
