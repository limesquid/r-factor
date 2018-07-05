import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class ButtonComponent extends Component {
  render() {
    const { name } = this.props;

    return (
      <div>{name}</div>
    );
  }
}

ButtonComponent.propTypes = {
  name: PropTypes.string
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export const Button = connect(mapStateToProps, mapDispatchToProps)(ButtonComponent);
