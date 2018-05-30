import React from 'react';
import PropTypes from 'prop-types';

export default (hoc) => {
  class Button extends React.Component {
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

  return Button;
};
