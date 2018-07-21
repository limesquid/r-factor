import React from 'react';
import PropTypes from 'prop-types';

import PanelGroup from './PanelGroup';

class Accordion extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  render() {
    const { className } = this.props;

    return (
      <PanelGroup {...this.props} accordion className={className}>
        {this.props.children}
      </PanelGroup>
    );
  }
}

export default Accordion;
