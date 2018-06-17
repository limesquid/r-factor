import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class Button extends Component {
  render() {
    const { a } = this.props;

    return (
      <div>{hoc}{a}</div>
    );
  }
}

Button.propTypes = {
  a: PropTypes.string
};
