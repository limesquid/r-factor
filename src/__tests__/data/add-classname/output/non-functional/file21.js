import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const hoc = (x) => {
  class X extends Component {
    static propTypes = {
      a: PropTypes.number,
      className: PropTypes.string,
      d: PropTypes.number
    };

    render() {
      const {
        a: b = 1,
        className,
        d: e = 2
      } = this.props;

      return (
        <div
          a={3}
          className={classNames(
            b,
            e,
            className
          )}
          d={4}>
          asd
        </div>
      );
    }
  }

  return X;
};

export default hoc;
