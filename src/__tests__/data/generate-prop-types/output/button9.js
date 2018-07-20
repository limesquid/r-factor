import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Button extends Component {
  static propTypes = {
    html: PropTypes.any,
    url: PropTypes.any
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { html, url } = this.props;

    return (
      <div>
        <div>
        </div>
      </div>
    );
  }
}

export default Button;
