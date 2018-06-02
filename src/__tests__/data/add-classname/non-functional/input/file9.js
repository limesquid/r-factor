import React, { Component } from 'react';
import PropTypes from 'prop-types';

class X extends Component {
  static propTypes = {
    a: PropTypes.number,
    d: PropTypes.number
  };

  render() {
    const { a, d, ...rest } = this.props;

    return (
      <div className={a}>
        asd
      </div>
    );
  }
}

export default X;
