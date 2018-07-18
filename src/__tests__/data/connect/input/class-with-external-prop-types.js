import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class Button extends Component {
  render() {
    const { name } = this.props;

    return (
      <div>{name}</div>
    );
  }
}

Button.propTypes = {
  name: PropTypes.string
};
