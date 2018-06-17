import React from 'react';
import { connect } from 'react-redux';

export default (hoc) => {
  const Button = () => (
    <div>{hoc}Test</div>
  );

  const mapStateToProps = (state) => ({

  });

  const mapDispatchToProps = {

  };

  return connect(mapStateToProps, mapDispatchToProps)(Button);
};
