import React, { Component } from 'react';

export default (hoc) => {
  class Button extends Component {
    render() {
      return (
        <div>
          {hoc}
        </div>
      );
    }
  }

  return Button;
};
