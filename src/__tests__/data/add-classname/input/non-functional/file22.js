import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class X extends Component {
  static propTypes = {
    a: PropTypes.number,
    d: PropTypes.number
  };

  render() {
    const { a, d } = this.props;

    return (
      <div className={classNames()}>
        asd
      </div>
    );
  }
}

export default X;
