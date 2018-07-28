import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export default (hoc) => {
  const Button = ({ name }) => (
    <div>{hoc}{name}</div>
  );

  Button.propTypes = {
    name: PropTypes.string
  };

  const mapStateToProps = (state) => ({
    
  });

  const mapDispatchToProps = {
    
  };

  return connect(mapStateToProps, mapDispatchToProps)(Button);
};
