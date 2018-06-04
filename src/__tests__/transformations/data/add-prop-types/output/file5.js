import React, { Component } from 'react';
import PropTypes from 'prop-types';

class X extends Component {
  static propTypes = {
    f: PropTypes.func.isRequired
  };

  render() {
    return (
      <div>
        asd
      </div>
    );
  }
}

export default X;
