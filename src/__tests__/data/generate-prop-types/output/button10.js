import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class Button extends Component {
  static propTypes = {
    value: PropTypes.any
  };

  render() {
    return (
      <div>{this.props.value}</div>
    );
  }
}
