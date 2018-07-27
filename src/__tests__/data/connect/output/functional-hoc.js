import React from 'react';
import { connect } from 'react-redux';

export default (hoc) => {
  const text = 'Test text';

  const Button = () => (
    <div>{hoc}Test{text}</div>
  );

  const mapStateToProps = (state) => ({
    
  });

  const mapDispatchToProps = {};

  return connect(mapStateToProps, mapDispatchToProps)(Button);
};
