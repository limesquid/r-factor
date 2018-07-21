import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default (hoc) => {
  class Button extends Component {
    static propTypes = {
      name: PropTypes.string
    };

    render() {
      const { name } = this.props;

      return (
        <div>{hoc}{name}</div>
      );
    }
  }

  return Button;
};
