import _ from 'lodash';
import React from 'react';

function f() {
  function Header({ onClick, children }) {
    return (
      <div className="header" onClick={_.debounce(onClick, 100)}>
        {children}
      </div>
    );
  }
}

export default f;
