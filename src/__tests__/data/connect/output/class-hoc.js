import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export default (hoc) => {
  class Button extends Component {
    static propTypes = {
      name: PropTypes.string
    };

    render() {
      const { name } = this.props;

      return (
        <div>{hoc}{name}</div>
      );
    }
  }

  const mapStateToProps = (state) => ({
    
  });

  const mapDispatchToProps = {
    
  };

  return connect(mapStateToProps, mapDispatchToProps)(Button);
};
