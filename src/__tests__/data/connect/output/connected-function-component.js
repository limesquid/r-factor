import React from 'react';
import { connect } from 'react-redux';

function Button() {
  return (
    <span>123</span>
  );
}

const mapStateToProps = (state) => ({
  a: 2
});

const mapDispatchToProps = {
  
};

export default connect(mapStateToProps, mapDispatchToProps)(Button);
