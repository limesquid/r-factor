import React from 'react';
import { connect } from 'react-redux';

const Button = ({ name }) => (<span>{name}</span>);

const mapStateToProps = (state) => ({
  name: state.name
});

export default connect(mapStateToProps)(Button);
