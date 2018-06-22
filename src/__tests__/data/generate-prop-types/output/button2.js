import React from 'react';
import PropTypes from 'prop-types';

const Button = (props) => {
  const { onClick } = props;

  return (
    <div onClick={onClick}>
      {props.children}
    </div>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func
};
