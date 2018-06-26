import React from 'react';
import PropTypes from 'prop-types';
import { Form, Message } from 'semantic-ui-react';

const Input = ({ className, errors, ...props }) => (
  <>
    <Form.Input {...props} className={className} />
    {errors && errors.length > 0 && (
      <Message error list={errors} />
    )}
  </>
);

Input.propTypes = {
  className: PropTypes.string,
  errors: PropTypes.array.isRequired
};

export default Input;
