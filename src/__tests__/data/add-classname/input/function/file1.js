import _ from 'lodash';
import React from 'react';

function Header({ onClick, children }) {
  return (
    <div className="header" onClick={_.debounce(onClick, 100)}>
      {children}
    </div>
  );
}

export default Header;
