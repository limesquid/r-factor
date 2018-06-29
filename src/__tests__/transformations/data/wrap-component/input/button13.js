import React, { ComponentComponent } from 'react';
import PropTypes from 'prop-types';

export default class extends PureComponent {
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
