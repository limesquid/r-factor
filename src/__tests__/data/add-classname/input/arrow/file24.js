import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const hoc = (x) => {
  const X = ({
    d: e = 2,
    a: b = 1
  }) => (
    <div
      a={3}
      className={classNames(
        `xxx ${x}`,
        b,
        e
      )}
      d={4}>
      asd
    </div>
  );

  X.propTypes = {
    d: PropTypes.number,
    a: PropTypes.number
  };

  return X;
};

export default hoc;
