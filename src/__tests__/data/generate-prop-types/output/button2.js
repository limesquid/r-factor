import PropTypes from 'prop-types';
import React from 'react';

const Button = (props) => {
  const { onClick } = props;

  return (
    <div onClick={onClick}>
      {props.children}
    </div>
  );
}

Button.propTypes = {
  children: PropTypes.any,
  onClick: PropTypes.any
};
