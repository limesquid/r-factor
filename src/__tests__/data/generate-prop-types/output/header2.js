import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

function f() {
  function Header({ onClick, children }) {
    return (
      <div className="header" onClick={_.debounce(onClick, 100)}>
        {children}
      </div>
    );
  }

  Header.propTypes = {
    children: PropTypes.node,
    onClick: PropTypes.func
  };
}

export default f;
