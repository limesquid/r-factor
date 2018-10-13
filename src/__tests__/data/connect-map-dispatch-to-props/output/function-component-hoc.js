import React from 'react';
import { connect } from 'react-redux';

export default (hoc) => {
  function Button() {
    return (
      <span>123</span>
    );
  }

  const mapDispatchToProps = {
    
  };

  return connect(null, mapDispatchToProps)(Button);
};
