import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export default (hoc) => {
  class Component extends PureComponent {
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

  const mapStateToProps = (state) => ({});

  const mapDispatchToProps = {};

  return connect(mapStateToProps, mapDispatchToProps)(Component);
};
