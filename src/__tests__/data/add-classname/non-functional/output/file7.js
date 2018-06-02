import React, { Component } from 'react';
import PropTypes from 'prop-types';

class X extends Component {
  static propTypes = {
    a: PropTypes.number,
    className: PropTypes.string,
    d: PropTypes.number
  };

  render() {
    const { a, className, d } = this.props;

    return (
      <div className={className}>
        asd
      </div>
    );
  }
}

export default X;
