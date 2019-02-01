import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withRouter from 'react-router-dom';

class Button extends Component {
  render() {
    const { name, match } = this.props;
    console.log(match);

    return (
      <div>{name}</div>
    );
  }
}

Button.propTypes = {
  name: PropTypes.string
};

export default withRouter(Button);
