import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export default (hoc) => {
  class Button extends Component {
    static propTypes = {
      a: PropTypes.string
    };

    render() {
      const { a } = this.props;

      return (
        <div>{hoc}{a}</div>
      );
    }
  }

  const mapStateToProps = (state) => ({});

  const mapDispatchToProps = {};

  return connect(mapStateToProps, mapDispatchToProps)(Button);
};
