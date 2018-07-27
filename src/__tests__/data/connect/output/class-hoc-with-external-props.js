import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export default (hoc) => {
  class Button extends Component {
    render() {
      const { name } = this.props;

      return (
        <div>{hoc}{name}</div>
      );
    }
  }

  Button.propTypes = {
    name: PropTypes.string
  };

  const mapStateToProps = (state) => ({
    
  });

  const mapDispatchToProps = {};

  return connect(mapStateToProps, mapDispatchToProps)(Button);
};
