import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

export default (hoc) => {
  class Button extends Component {
    render() {
      const { name } = this.props;

      return (
        <div>{hoc}{name}</div>
      );
    }
  }

  Button.propTypes = {
    name: PropTypes.string
  };

  return withRouter(Button);
};
