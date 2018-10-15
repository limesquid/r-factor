import React from 'react';
import PropTypes from 'prop-types';

export default (hoc) => {
  const InnerComponent = ({ prop }) => (
    <div>{hoc}Test{prop}</div>
  );

  InnerComponent.propTypes = {
    prop: PropTypes.any
  };

  return InnerComponent;
};
