import _ from 'lodash';
import React from 'react';

function f() {
  const Header = ({ onClick, children }) => (
    <div className="header" onClick={_.debounce(onClick, 100)}>
      {children}
    </div>
  );
}

export default Header;
