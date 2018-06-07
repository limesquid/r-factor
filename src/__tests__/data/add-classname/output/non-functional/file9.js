import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class X extends Component {
  static propTypes = {
    a: PropTypes.number,
    className: PropTypes.string,
    d: PropTypes.number
  };

  render() {
    const { a, className, d, ...rest } = this.props;

    return (
      <div className={classNames(a, className)}>
        asd
      </div>
    );
  }
}

export default X;