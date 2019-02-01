import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

class ButtonComponent extends Component {
  static propTypes = {
    className: PropTypes.string
  };

  render() {
    const { className } = this.props;

    return (
      <div className={className}>{this.props.value}</div>
    );
  }
}

export const Button = withRouter(ButtonComponent);
