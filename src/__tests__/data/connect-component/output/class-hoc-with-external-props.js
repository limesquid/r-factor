import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export default (hoc) => {
  class Button extends Component {
    render() {
      const { a } = this.props;

      return (
        <div>{hoc}{a}</div>
      );
    }
  }

  Button.propTypes = {
    a: PropTypes.string
  };

  const mapStateToProps = (state) => ({});

  const mapDispatchToProps = {};

  return connect(mapStateToProps, mapDispatchToProps)(Button);
};
