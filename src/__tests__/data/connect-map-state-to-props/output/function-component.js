import React from 'react';
import { connect } from 'react-redux';

function Button() {
  return (
    <span>123</span>
  );
}

const mapStateToProps = (state) => ({
  
});

export default connect(mapStateToProps)(Button);
