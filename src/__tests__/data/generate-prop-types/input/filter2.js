import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@material-ui/core/Checkbox';

const Filter = ({ options, value }) => options.length > 0 ? (
  <div>
    {options.map((option) => (
      <Checkbox />
    ))}
  </div>
) : null;

Filter.propTypes = {

};

export default Filter;
