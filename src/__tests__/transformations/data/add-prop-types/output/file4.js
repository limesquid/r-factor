import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@material-ui/core/Checkbox';

const Filter = ({ options, value }) => (
  <div>
    {options.map((option) => (
      <Checkbox />
    ))}
  </div>
);

Filter.propTypes = {
  f: PropTypes.func.isRequired,
  options: PropTypes.any,
  value: PropTypes.any
};

export default Filter;
