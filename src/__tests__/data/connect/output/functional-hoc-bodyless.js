import React from 'react';
import { connect } from 'react-redux';

export default hoc => {
  const InnerComponent = ({ prop }) => (
    <div>{hoc}Test{prop}</div>
  );

  const mapStateToProps = (state) => ({
    
  });

  const mapDispatchToProps = {};

  return connect(mapStateToProps, mapDispatchToProps)(InnerComponent);
};
