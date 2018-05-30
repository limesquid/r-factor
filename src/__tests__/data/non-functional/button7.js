import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default (hoc) => {
  class Button extends PureComponent {
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
