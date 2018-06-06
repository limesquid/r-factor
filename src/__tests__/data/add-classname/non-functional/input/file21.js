import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const hoc = (x) => {
  class X extends Component {
    static propTypes = {
      a: PropTypes.number,
      d: PropTypes.number
    };

    render() {
      const {
        a: b = 1,
        d: e = 2
      } = this.props;

      return (
        <div
          a={3}
          className={classNames(
            b,
            e
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
