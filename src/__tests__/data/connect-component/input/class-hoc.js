import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default (hoc) => {
  class Button extends Component {
    static propTypes = {
      a: PropTypes.string
    };

    render() {
      const { a } = this.props;

      return (
        <div>{hoc}{a}</div>
      );
    }
  }

  return Button;
};
