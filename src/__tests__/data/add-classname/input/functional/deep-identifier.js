import React from 'react';
import PropTypes from 'prop-types';
import { Form, Message } from 'semantic-ui-react';

const Input = ({ errors, ...props }) => (
  <>
    <Form.Input {...props} />
    {errors && errors.length > 0 && (
      <Message error list={errors} />
    )}
  </>
);

Input.propTypes = {
  errors: PropTypes.array.isRequired
};

export default Input;
