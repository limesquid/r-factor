import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class PrefixButtonSuffix extends Component {
  render() {
    const { a } = this.props;

    return (
      <div>{a}</div>
    );
  }
}

PrefixButtonSuffix.propTypes = {
  a: PropTypes.string
};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = {

};

export const Button = connect(mapStateToProps, mapDispatchToProps)(PrefixButtonSuffix);
