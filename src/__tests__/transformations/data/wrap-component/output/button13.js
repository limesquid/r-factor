import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

class ButtonComponent extends PureComponent {
  static propTypes = {
    name: PropTypes.string
  };

  render() {
    const { name } = this.props;
    return (
      <div>
        {name}
      </div>
    );
  }
}

export const Button = withRouter(ButtonComponent);
