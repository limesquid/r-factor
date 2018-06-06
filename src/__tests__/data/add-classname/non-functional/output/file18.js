import React, { Component } from 'react';
import PropTypes from 'prop-types';

class X extends Component {
  static propTypes = {
    className: PropTypes.string
  };

  render() {
    const { className } = this.props;

    return (
      <div
        a
        b={3}
        className={className}>
        asd
      </div>
    );
  }
}

export default X;
