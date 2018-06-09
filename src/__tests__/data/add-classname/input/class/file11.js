import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class X extends Component {
  static propTypes = {
    a: PropTypes.number,
    d: PropTypes.number
  };

  render() {
    const { a: b, d: e } = this.props;

    return (
      <div className={classNames(b, e)}>
        asd
      </div>
    );
  }
}

export default X;
