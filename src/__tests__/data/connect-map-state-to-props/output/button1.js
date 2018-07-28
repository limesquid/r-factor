import React from 'react';
import { connect } from 'react-redux';

const Button = ({ value }) => (
  <div>{value}</div>
);

const mapStateToProps = (state) => ({
  
});

export default connect(mapStateToProps)(Button);
