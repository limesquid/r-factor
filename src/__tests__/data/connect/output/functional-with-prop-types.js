import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const ButtonComponent = (props) => (
  <div>Button {prop.name}</div>
);

ButtonComponent.propTypes = {
  name: PropTypes.string
};

const mapStateToProps = (state) => ({
  
});

const mapDispatchToProps = {
  
};

export const Button = connect(mapStateToProps, mapDispatchToProps)(ButtonComponent);
